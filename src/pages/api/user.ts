// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//サーバー側
import { cookieOptions } from '@/constants/cookieOptions';
import { getCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/firebase/firebaseAdminClient';
import { bucket } from '@/lib/cloudStorage';
import { z } from 'zod';
import { UserT } from '@/types/UserT';

export type PostUserRequestBody = '';

export type GetUserResponseSuccessBody = {
  user: UserT;
};

export type PatchUserRequestBody = {
  name: string;
  avatarFileKey: string | null;
  avatarOriginalFileName: string | null;
  activityAreas: string | null;
  favoriteType: string | null;
  strongPoints: string | null;
  favoriteGroup: string | null;
};

export type PatchUserResponseSuccessBody = '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = (await getCookie('token', {
    ...cookieOptions,
    req,
    res,
  })) as string;
  console.log(token);
  //バリデーションチェック
  if (!token) {
    //tokenがfalseの場合status401を返す
    res.status(401).json({ error: 'authentication faild' });
    return;
  }
  //トークンの検証をする

  try {
    const decodedToken = await auth.verifyIdToken(token); //トークンの検証に成功したらデータの復号化したデータを返す
    const uid = decodedToken.uid; //復号化したデータの中のuidを取り出す
    const isEmailVerified = decodedToken.email_verified;
    const user = await prisma.user.findUnique({
      //取り出したuidがusertable内で重複が無いかを確認する
      where: {
        uid: uid,
      },
      //uidに紐づくeventをとってくる　include→含む
      //userホバーするとみられる
      include: { events: true },
    });
    if (req.method === 'POST') {
      if (!!user) {
        //userが存在した場合
        res.status(409).json({ error: 'Duplicate' });
        return;
      }
      await prisma.user.create({
        //uidとランダム文字列のnameをデータベースに登録＝user
        data: {
          uid,
          name: Math.random().toString(32).substring(2),
        },
      });
      res.status(200).end(); //登録完了をresする
      return;
    } else {
      //methodがPOST以外の場合
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
        const options = {
          //as constをつけて、そのもののみ受け付けるようにする
          version: 'v4' as const,
          action: 'read' as const,
          expires: Date.now() + 5 * 60 * 1000,
        };

        let avatarUrl = null;
        //avatarUrlの変数を作る事によって、data: GetUserResponseSuccessBody内でもurlを使えるようにした
        if (!!user.avatarFileKey) {
          const [url] = await bucket
            .file(user.avatarFileKey)
            .getSignedUrl(options);
          avatarUrl = url;
        }

        const totalEvents = user.events.filter((event) => {
          return event.success !== null;
        });
        const successEvent = user.events.filter((event) => {
          return event.success === true;
        });
        let winRate = null;
        if (totalEvents.length === 0) {
          winRate = null;
        } else {
          winRate = (successEvent.length / totalEvents.length) * 100;
        }

        const data: GetUserResponseSuccessBody = {
          user: {
            id: user.id,
            name: user.name,
            avatarUrl: avatarUrl,
            activityAreas: user.activityAreas,
            favoriteType: user.favoriteType,
            strongPoints: user.strongPoints,
            favoriteGroup: user.favoriteGroup,
            winRate: winRate,
          },
        };
        res.status(200).json(data);
      } else if (req.method === 'PATCH') {
        const body = req.body as PatchUserRequestBody;
        const rawData = {
          name: body.name,
          avatarFileKey: body.avatarFileKey,
          avatarOriginalFileName: body.avatarOriginalFileName,
          activityAreas: body.activityAreas,
          favoriteType: body.favoriteType,
          strongPoints: body.strongPoints,
          favoriteGroup: body.favoriteGroup,
        };
        const eventScheme = z
          .object({
            name: z.string(),
            avatarFileKey: z.string().nullable(),
            avatarOriginalFileName: z.string().nullable(),
            activityAreas: z
              .string()
              .max(255, { message: '文字数超過' })
              .nullable(),
            favoriteType: z
              .string()
              .max(255, { message: '文字数超過' })
              .nullable(), //nullかも
            strongPoints: z
              .string()
              .max(255, { message: '文字数超過' })
              .nullable(),
            favoriteGroup: z
              .string()
              .max(255, { message: '文字数超過' })
              .nullable(),
          })
          .refine(
            //終了日時がnull、もしくは終了時刻が開始日時より後の場合正しい入力値とする。
            (data) =>
              (!!data.avatarFileKey && !!data.avatarOriginalFileName) ||
              (!data.avatarFileKey && !data.avatarOriginalFileName),
            {
              message: 'データが一致しません',
              path: ['avatarFileKey'],
            }
          );
        const result = eventScheme.safeParse(rawData);
        if (!result.success) {
          res.status(422).json({ error: '入力を間違えています' });
          return;
        }
        const editData = result.data;
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: editData,
        });

        res.status(200).end();
      } else {
        res.status(405).json({ error: 'method not allowed' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to register' }); //例外なエラーが発生した時500をresする
    console.log(error);
  }
}
