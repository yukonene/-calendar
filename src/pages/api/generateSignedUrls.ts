import { cookieOptions } from '@/constants/cookieOptions';
import { getCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/firebase/firebaseAdminClient';
import { bucket } from '@/lib/cloudStorage';
import { z } from 'zod';

export type PostGenerateSignedUrlsRequestBody = {
  uploadLength: number;
};

export type PostGenerateSignedUrlsResposeSuccessBody = {
  uploads: { signedGcsUrl: string; fileKey: string }[];
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

    if (req.method === 'POST') {
      // アドレスにアクセスされた時に以下を実行
      const body = req.body as PostGenerateSignedUrlsRequestBody;
      const rawData = {
        uploadLength: body.uploadLength,
      };
      const signedUrlsScheme = z.object({
        uploadLength: z.number().positive(),
      });
      const result = signedUrlsScheme.safeParse(rawData);
      if (!result.success) {
        res.status(422).json({ error: '入力を間違えています' });
        return;
      }
      const resultData = result.data;

      const fileKeys = [...Array(resultData.uploadLength)].map((_) =>
        crypto.randomUUID()
      );
      //例）[fileKey1,fileKey2,fileKey3,fileKey4]
      const signedUrlsReqArr = fileKeys.map((fileKey) => {
        return bucket.file(fileKey).getSignedUrl({
          // 現在ログインしているアカウント(=サービスアカウント)で対象ファイルへ自由に書き込みできる権利を与える
          version: 'v4',
          action: 'write',
          expires: Date.now() + 5 * 60 * 1000, // 作成から5分
          contentType: 'application/octet-stream',
        });
      });
      const signedUrlsReqResult = await Promise.all(signedUrlsReqArr);
      // 例) [[signedGcsUrl1], [signedGcsUrl2], [signedGcsUrl3], [signedGcsUrl4]]

      const uploads = fileKeys.map((fileKey, i) => {
        return {
          signedGcsUrl: signedUrlsReqResult[i][0],
          fileKey: fileKey,
        };
      });

      // signedGcsUrlを返す
      res.status(200).json({ uploads });
    } else {
      res.status(405).json({ error: 'method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'アップロードに失敗しました' }); //例外なエラーが発生した時500をresする
    console.log('error', JSON.stringify(error));
  }
}
