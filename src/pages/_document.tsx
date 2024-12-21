import { useFirebaseUserContext } from '@/conponents/common/FirebaseUserProvider';
import { cookieOptions } from '@/constants/cookieOptions';
import { auth } from '@/lib/firebase/firebaseClient';
import { deleteCookie, setCookie } from 'cookies-next';
import { Html, Head, Main, NextScript } from 'next/document';
import { useEffect } from 'react';

export default function Document() {
  const { setFirebaseUser } = useFirebaseUserContext();
  useEffect(() => {
    //期限切れトークンの再セット
    const unsubscribed = auth.onAuthStateChanged((user) => {
      setFirebaseUser(user);
      //onAuthStateChangedとは、「userの中身が切り替わった際動くuser以下関数」と「それを止める関数の返り値」を合わせもつもの
      if (!user) {
        //userがnullになった時、deleteCookieする
        deleteCookie('token', cookieOptions);
      } else {
        //それ以外は新たなトークンをセットする。
        user
          .getIdToken() //トークン取得
          .then((token) => {
            setCookie('token', token, cookieOptions);
          });
      }
    });
    return () => {
      //return以下が関数の場合、conponentが消滅する際に実行される
      unsubscribed();
    };
  }, []);
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
