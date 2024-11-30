// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//サーバー側
import { cookieOptions } from '@/constants/cookieOptions';
import { getCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const token = getCookie('token', { ...cookieOptions, req, res }) as string;
    //バリデーションチェック
    if (!token) {
      //tokenがfalseの場合status401を返す
      res.status(401).end('authentication faild');
      return;
    }
    //トークンの検証をする

    const auth = getAuth();
    try {
      const decodedToken = await auth.verifyIdToken(token);
      const uid = decodedToken.uid;
    } catch (error) {
      console.error('Error verifying idToken:', error);
      throw error;
    }
  } else {
    res.status(405).end('method not allowed');
  }
  // res.status(200).json({ name: "John Doe" });
}
