import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useFirebaseUserContext } from './FirebaseUserProvider';
import { UserT } from '@/types/UserT';
import { auth } from '@/lib/firebase/firebaseClient';
import { useRouter } from 'next/router';
import axios from 'axios';
import { GetUserResponseSuccessBody } from '@/pages/api/user';
import { Avatar, Box, Button } from '@mui/material';
import Link from 'next/link';

// レイアウトという名前の新しいコンポーネントを作ります
export default function Layout({ children }: { children: ReactNode }) {
  const { firebaseUser, setFirebaseUser } = useFirebaseUserContext();
  const [user, setUser] = useState<UserT>();
  const router = useRouter();

  const logout = () => {
    auth.signOut();
    setFirebaseUser(null);
    router.push('/login');
  };

  const getProfile = useCallback(() => {
    //基本的にはusecallbackつける
    axios
      .get<GetUserResponseSuccessBody>('/api/user/')
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  useEffect(() => {
    if (!!firebaseUser) {
      getProfile();
    }
  }, [getProfile, firebaseUser]);

  return (
    // レイアウトはメニューバー、
    // 主要な内容（children）、そしてフッターの3つの部分から成り立ちます
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* トップバー */}
      <Box
        sx={{
          display: 'flex',
          borderBottom: '1px solid gray',
          flexDirection: 'column',
        }}
      >
        <Box>
          <Link
            href="/"
            passHref
            style={{
              fontSize: '20px',
              fontWeight: 'bolder',
              padding: '6px',
              color: '#008080',
            }}
          >
            {process.env.NEXT_PUBLIC_APP_TITLE}
          </Link>
        </Box>
        {!!firebaseUser && !!user && (
          <Box
            sx={{
              display: 'flex',
              marginLeft: 'auto',
              alignItems: 'center',
            }}
          >
            {!!user.avatarUrl && (
              <Link href="/profile" passHref>
                <Avatar
                  alt="avatar"
                  src={user.avatarUrl}
                  sx={{ width: 50, height: 50 }}
                />
              </Link>
            )}

            <Link href="/profile" passHref>
              <Button>{user.name}</Button>
            </Link>
          </Box>
        )}
        {/* ログインログアウト切り替え */}
        {!!firebaseUser ? (
          <Box sx={{ marginLeft: 'auto', fontSize: 'small' }}>
            <Button onClick={logout}>ログアウト</Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              marginLeft: 'auto',
              flexDirection: 'column',
            }}
          >
            <Link href="/login" passHref>
              <Button>ログイン</Button>
            </Link>
            <Link href="/register" passHref>
              <Button>新規会員登録</Button>
            </Link>
          </Box>
        )}
      </Box>
      <Box component={'main'} sx={{ flexGrow: 1, overflowY: 'hidden' }}>
        {children}
      </Box>
    </Box>
  );
}
