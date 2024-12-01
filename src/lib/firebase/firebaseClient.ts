import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';

//firebaseClientはブラウザ側で動くclient。
//firebaseに接続するためのcilentを立ち上げる。
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
//firebaseのサービスのうち、authenticationに接続するためのclientを取得する。
export const auth = getAuth();
