import { cookieOptions } from '@/constants/cookieOptions';
import { getCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/firebase/firebaseAdminClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
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
      } else {
        res.status(200).end();
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to register' }); //例外なエラーが発生した時500をresする
      console.log(error);
    }
  } else {
    res.status(405).json({ error: 'method not allowed' }); //methodがPOST以外の場合
  }
}