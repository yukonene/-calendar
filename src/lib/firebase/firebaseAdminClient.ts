import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { firebaseConfig } from './firebaseConfig';
import { getAuth } from 'firebase-admin/auth';

//firebaseAdominはサーバー側で動くclient。

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const app = getApp();
export const auth = getAuth(app);
