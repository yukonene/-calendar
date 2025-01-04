import { cookieOptions } from '@/constants/cookieOptions';
import { auth } from '@/lib/firebase/firebaseClient';
import { Box, CircularProgress } from '@mui/material';
import { deleteCookie, setCookie } from 'cookies-next';
import { User } from 'firebase/auth';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

const FirebaseUserContext = createContext(
  {} as {
    firebaseUser: User | null;
    setFirebaseUser: Dispatch<SetStateAction<User | null>>;
  }
);

//FirebaseUserProviderが巻かれているコンポーネント内でのみ使える
export const useFirebaseUserContext = () => {
  return useContext(FirebaseUserContext);
};
type Props = {
  children: ReactNode;
};

export const FirebaseUserProvider = ({ children }: Props) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  // 初回のfirebaseAuthへの認証状態確認が終わったらtrueになる
  const [isInitialised, setIsInitialised] = useState(false);

  useEffect(() => {
    //期限切れトークンの再セット
    const unsubscribed = auth.onAuthStateChanged((user) => {
      if (!isInitialised) {
        setIsInitialised(true);
      }
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
  }, [setFirebaseUser, isInitialised]);

  //ローディング中のuser内が空の時にCircularProgressを表示する
  //これによって一番下のretrunが表示されなくなる為user=undifindを避けられる
  if (!isInitialised) {
    return (
      <Box sx={{ display: 'flex', height: '100%' }}>
        <CircularProgress sx={{ margin: 'auto' }} />
      </Box>
    );
  }

  return (
    <FirebaseUserContext.Provider value={{ firebaseUser, setFirebaseUser }}>
      {children}
    </FirebaseUserContext.Provider>
  );
};
//後、_appで定義して全てのコンポーネントで使えるようにする
