import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useFirebaseUserContext } from '../../providers/FirebaseUserProvider';
import { UserT } from '@/types/UserT';
import { useRouter } from 'next/router';
import { Avatar, Box, Button } from '@mui/material';
import Link from 'next/link';
import { getUser } from '@/apis/users/getUser';

// レイアウトという名前の新しいコンポーネントを作ります
export default function Layout({ children }: { children: ReactNode }) {
  const { firebaseUser } = useFirebaseUserContext();
  const [user, setUser] = useState<UserT>();
  const router = useRouter();

  const getProfile = useCallback(() => {
    //基本的にはusecallbackつける
    getUser()
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
          alignItems: 'center',
          borderBottom: '1px solid gray',
          height: '55px',
          flexShrink: 0, //flexgrowの反対側につけておくと潰されない
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

        {/* ログインログアウト切り替え */}
        {!!firebaseUser && !!user ? (
          <Box sx={{ marginLeft: 'auto', paddingRight: '8px' }}>
            <Link href="/profile" passHref>
              {!!user.avatarUrl ? (
                <Avatar
                  alt="avatar"
                  src={user.avatarUrl}
                  sx={{ width: 50, height: 50 }}
                />
              ) : (
                user.name
              )}
            </Link>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              marginLeft: 'auto',
              gap: '8px',
            }}
          >
            <Link href="/login" passHref>
              <Button>ログイン</Button>
            </Link>
            <Link href="/register" passHref>
              <Button>新規登録</Button>
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
