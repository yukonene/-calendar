import { Box, Button } from '@mui/material';
import { NeneCalendar } from './Calendar';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebaseClient';
import { useRouter } from 'next/router';

import { useFirebaseUserContext } from './common/FirebaseUserProvider';
import Link from 'next/link';

export const Main = () => {
  const { firebaseUser, setFirebaseUser } = useFirebaseUserContext();
  const router = useRouter();

  const logout = () => {
    auth.signOut();
    setFirebaseUser(null);
    console.log('signout');
    router.push('/login');
  };

  return (
    <Box //全体の
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          paddingX: '16px',
          borderBottom: '1px solid gray',
        }}
      >
        {/* ログインログアウト切り替え */}
        {!!firebaseUser ? (
          <Box sx={{ marginLeft: 'auto' }}>
            <Button onClick={logout}>ログアウト</Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', marginLeft: 'auto', gap: '8px' }}>
            <Link href="/login" passHref>
              <Button>ログイン</Button>
            </Link>
            <Link href="/register" passHref>
              <Button>新規会員登録</Button>
            </Link>
          </Box>
        )}
      </Box>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Box sx={{ padding: '25px' }}>
          <NeneCalendar />
        </Box>

        <Box sx={{ padding: '25px' }}>日ごと</Box>
      </Box>
    </Box>
  );
};
