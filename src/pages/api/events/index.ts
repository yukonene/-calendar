import { cookieOptions } from '@/constants/cookieOptions';
import { getCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/firebase/firebaseAdminClient';
import { number, z } from 'zod';
import { EventT } from '@/types/EventT';
import { bucket } from '@/lib/cloudStorage';
import { endOfMonth, startOfMonth } from 'date-fns';
import { EventPhotoT } from '@/types/EventPhotoT';

//jsonの形でresで送ったもののタイプ。number,string,null,boolean
export type GetEventsResponseSuccessBody = {
  eventInfoList: { event: EventT; eventPhotos: EventPhotoT[] }[];
};

export type PostEventRequestBody = {
  title: string;
  startDateTime: string;
  endDateTime: string | null;
  place: string | null;
  url: string | null;
  member: string | null;
  memo: string | null;
};

export type PostEventResponseSuccessBody = '';

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
    const uid = decodedToken.uid; //復号化したデータの中のuidを取り出す
    const isEmailVerified = decodedToken.email_verified;
    const user = await prisma.user.findUnique({
      //取り出したuidがusertable内に存在するかを確認する
      where: {
        uid: uid,
      },
    });

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

    if (req.method === 'GET') {
      //////////////////クエリの受け取り////////////////////////////////////////
      const now = new Date();
      //startDateTimeStrがある場合はtoISOStringで変換された文字列になっている
      const startDateTimeStr = req.query.startDateTime;
      //選択したイベントの開始日時をDate型にして返す。
      // ページを開いた瞬間のイベントを選択していない状態、もしくはイベントが一つもない場合、今日の月を返す
      const startDatetime =
        !!startDateTimeStr && typeof startDateTimeStr === 'string'
          ? new Date(startDateTimeStr)
          : startOfMonth(now);
      //endDateTimeStrがある場合はtoISOStringで変換された文字列になっている
      const endDateTimeStr = req.query.endDateTime;
      const endDateTime =
        !!endDateTimeStr && typeof endDateTimeStr === 'string'
          ? new Date(endDateTimeStr)
          : endOfMonth(now);
      console.log(startDateTimeStr);
      // gte=greater than or equal（●●以上） lte=less than or equal(●●以下)
      const eventsInDB = await prisma.event.findMany({
        where: {
          userId: user.id,
          startDateTime: {
            gte: startDatetime,
            lte: endDateTime,
          },
        },
        include: { eventPhotos: true },
      });

      const options = {
        //as constをつけて、そのもののみ受け付けるようにする
        version: 'v4' as const,
        action: 'read' as const,
        expires: Date.now() + 5 * 60 * 1000,
      };

      //mapの関数内で非同期処理のasync、awaitと使うとき、map全体をawait Promise.allで囲うこと
      const eventInfoList = await Promise.all(
        eventsInDB.map(async (event) => {
          let eventPhotoUrl = null;
          let eventPhotoFileKey = null;
          if (event.eventPhotos.length > 0) {
            const eventPhoto = event.eventPhotos[0]; //1個しか入らない設定だから
            const [url] = await bucket
              .file(eventPhoto.fileKey)
              .getSignedUrl(options);
            eventPhotoUrl = url;
            eventPhotoFileKey = eventPhoto.fileKey;
          }
          return {
            event: {
              id: event.id,
              title: event.title,
              //jsonは文字列の一つの形式の為date型を送れない。
              // そのためstring型にするが、stringだとSat Dec 14 2024 20:36:06 GMT+0900 (日本標準時)でわかりにくい為、
              // toISOSting()でISO8601の表示形式にする'2024-12-14T11:36:06.137Z'
              startDateTime: event.startDateTime.toISOString(),
              endDateTime: event.endDateTime?.toISOString() || null,
              place: event.place,
              url: event.url,
              member: event.member,
              memo: event.memo,
              diary: event.diary,
              success: event.success,
            },
            eventPhotos:
              !!eventPhotoUrl && !!eventPhotoFileKey
                ? [{ url: eventPhotoUrl, fileKey: eventPhotoFileKey }]
                : [],
          };
        })
      );

      const data: GetEventsResponseSuccessBody = {
        eventInfoList: eventInfoList,
      };

      res.status(200).json(data);

      // ここからPOST
    } else if (req.method === 'POST') {
      const body = req.body as PostEventRequestBody; //reqのbodyを取得
      const rawData = {
        //生(raw)のデータ
        //startDateTime、endDateTimeを文字列(jsonの中身)からdate型(javascript)に戻した。
        title: body.title,
        startDateTime: new Date(body.startDateTime),
        endDateTime: !!body.endDateTime ? new Date(body.endDateTime) : null,
        place: body.place,
        url: body.url,
        member: body.member,
        memo: body.memo,
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
      const data = result.data;
      await prisma.event.create({
        data: data,
      });
      res.status(200).end();
    } else {
      //methodがPOST以外の場合
      res.status(405).json({ error: 'method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to register' }); //例外なエラーが発生した時500をresする
    console.log(error);
  }
}
