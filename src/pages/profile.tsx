import { User } from '@/components/user/User';
import { cookieOptions } from '@/constants/cookieOptions';
import { auth } from '@/lib/firebase/firebaseAdminClient';
import prisma from '@/lib/prisma';
import { getCookie } from 'cookies-next';
import type { GetServerSideProps } from 'next';

//-----------------SSR（server side rendaring)-------------------------------------
//ページが表示される前に一度だけサーバー側で行われるrendaring(処理)
// 基本的に形は一緒
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const token = (await getCookie('token', {
    ...cookieOptions,
    req,
    res,
  })) as string;
  if (!token) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  try {
    const decodedToken = await auth.verifyIdToken(token);
    //トークンの検証に成功したらデータの復号化したデータを返す
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
    if (!isEmailVerified) {
      return { redirect: { destination: '/login', permanent: false } };
    }
    if (!user) {
      return { redirect: { destination: '/login', permanent: false } };
    }
  } catch (error) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  // ↑↑バリデーションを全てクリアしたら、↓↓下にたどり着く
  return {
    props: {},
  };
};

export default function ProfilePage() {
  return <User />;
}
