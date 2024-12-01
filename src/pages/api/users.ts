// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//サーバー側
import { cookieOptions } from '@/constants/cookieOptions';
import { getCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/firebase/firebaseAdminClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(1);
  if (req.method === 'POST') {
    const token = (await getCookie('token', {
      ...cookieOptions,
      req,
      res,
    })) as string;
    console.log(token);
    //バリデーションチェック
    if (!token) {
      //tokenがfalseの場合status401を返す
      res.status(401).end('authentication faild');
      return;
    }
    //トークンの検証をする

    try {
      const decodedToken = await auth.verifyIdToken(token); //トークンの検証に成功したらデータの復号化したデータを返す
      const uid = decodedToken.uid; //復号化したデータの中のuidを取り出す
      const user = await prisma.user.findUnique({
        //取り出したuidがusertable内で重複が無いかを確認する
        where: {
          uid: uid,
        },
      });
      if (!!user) {
        //userが存在した場合
        res.status(409).end('Duplicate');
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
    } catch (error) {
      res.status(500).end('Failed to register'); //例外なエラーが発生した時500をresする
      console.log(error);
    }
  } else {
    res.status(405).end('method not allowed'); //methodがPOST以外の場合
  }
}
