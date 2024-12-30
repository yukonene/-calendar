import { cookieOptions } from '@/constants/cookieOptions';
import { getCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/firebase/firebaseAdminClient';
import { z } from 'zod';
import { EventT } from '@/types/EventT';

export type GetEventResponseSuccessBody = {
  event: EventT;
};

export type PatchEventResponseSuccessBody = '';

export type DeleteEventResponseSuccessBody = '';

export type PatchEventRequestBody = {
  title: string;
  startDateTime: string;
  endDateTime: string | null;
  place: string | null;
  url: string | null;
  member: string | null;
  memo: string | null;
  diary: string | null;
  success: boolean | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = (await getCookie('token', {
    ...cookieOptions,
    req,
    res,
  })) as string;

  //バリデーションチェック
  if (!token) {
    //tokenがfalseの場合status401を返す
    res.status(401).json({ error: 'authentication faild' });

    return;
  }

  try {
    //トークンの検証をする

    const decodedToken = await auth.verifyIdToken(token); //トークンの検証に成功したらデータの復号化したデータを返す
    console.log('token', token);
    const uid = decodedToken.uid; //復号化したデータの中のuidを取り出す
    const isEmailVerified = decodedToken.email_verified;
    const user = await prisma.user.findUnique({
      //取り出したuidがusertable内に存在するかを確認する
      where: {
        uid: uid,
      },
    });
    console.log('user', user);
    if (!isEmailVerified) {
      res
        .status(401)
        .json({ error: 'メールアドレスの認証が終わっていません。' });
      return;
    }
    if (!user) {
      res.status(409).json({ error: '登録情報がありません。' });
      return;
    }

    const eventId = req.query.id;
    //javascriptのタイプチェック↓
    if (!eventId || typeof eventId !== 'string') {
      res.status(400).json({ error: '不正なリクエストです。' });
      return;
    }

    const event = await prisma.event.findUnique({
      where: {
        //user.idとevent.id両方一致するものを探す
        userId: user.id,
        id: Number(eventId),
      },
    });
    if (!event) {
      res.status(404).json({ error: 'イベント情報がありません。' });
      return;
    }

    //イベントIDが正しいかのバリデーション↑　↓情報取得

    if (req.method === 'GET') {
      const data: GetEventResponseSuccessBody = {
        event: {
          id: event.id,
          title: event.title,
          //jsonは文字列の一つの形式の為date型を送れない。
          // そのためstring型にするが、stringだとSat Dec 14 2024 20:36:06 GMT+0900 (日本標準時)でわかりにくい為、
          // toISOSting()でISO8601の表示形式にする'2024-12-14T11:36:06.137Z'
          startDateTime: event.startDateTime.toISOString(),
          endDateTime: event.endDateTime?.toISOString() || null,
          place: event.place || null,
          url: event.url || null,
          member: event.member || null,
          memo: event.memo || null,
          diary: event.diary || null,
          success: event.success || null,
        },
      };
      res.status(200).json(data);
    } else if (req.method === 'PATCH') {
      const body = req.body as PatchEventRequestBody;
      const rawData = {
        title: body.title,
        startDateTime: new Date(body.startDateTime),
        endDateTime: !!body.endDateTime ? new Date(body.endDateTime) : null,
        place: body.place,
        url: body.url,
        member: body.member,
        memo: body.memo,
        diary: body.diary,
        success: body.success,
        userId: user.id,
      };
      const eventScheme = z
        .object({
          title: z
            .string()
            .min(1, { message: 'イベントタイトルを入力してください' })
            .max(50, { message: 'イベントタイトルが長すぎます' }),
          startDateTime: z.date(),
          endDateTime: z.date().nullable(), //nullかも
          place: z.string().max(100, { message: '文字数超過' }).nullable(),
          url: z.string().max(200, { message: '文字数超過' }).nullable(),
          member: z.string().max(100, { message: '文字数超過' }).nullable(),
          memo: z.string().max(255, { message: '文字数超過' }).nullable(),
          diary: z.string().max(10000, { message: '文字数超過' }).nullable(),
          success: z.boolean().nullable(),
          userId: z.number(),
        })
        .refine(
          //終了日時がnull、もしくは終了時刻が開始日時より後の場合正しい入力値とする。
          (data) => !data.endDateTime || data.startDateTime <= data.endDateTime,
          {
            message: '終了日時は開始日時の後に設定してください',
            path: ['endDateTime'],
          }
        );
      const result = eventScheme.safeParse(rawData);
      if (!result.success) {
        res.status(422).json({ error: '入力を間違えています' });
        return;
      }
      const editData = result.data;
      await prisma.event.update({
        where: {
          id: event.id,
        },
        data: editData,
      });

      res.status(200).end();
    } else if (req.method === 'DELETE') {
      await prisma.event.delete({
        where: {
          id: event.id,
        },
      });
      res.status(200).end();
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to register' }); //例外なエラーが発生した時500をresする
    console.log(error);
  }
}
