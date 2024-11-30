import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// .envファイルで設定した環境変数をfirebaseConfigに入れる
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APPID,
};

//firebaseに接続するためのcilentを立ち上げる。
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
//firebaseのサービスのうち、authenticationに接続するためのclientを取得する。
export const auth = getAuth();
