import { Box, Button } from '@mui/material';
import { NeneCalendar } from './Calendar';
import { auth } from '@/lib/firebase/firebaseClient';
import { useRouter } from 'next/router';
import { Event } from './Event';
import { useFirebaseUserContext } from './common/FirebaseUserProvider';
import Link from 'next/link';
import { useState } from 'react';

export const Main = () => {
  const { firebaseUser, setFirebaseUser } = useFirebaseUserContext();
  const router = useRouter();

  const logout = () => {
    auth.signOut();
    setFirebaseUser(null);
    console.log('signout');
    router.push('/login');
  };

  const [eventId, setEventId] = useState<number>();
  console.log(eventId);
  //イベントページ表示

  return (
    <Box //全体の
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* トップバー */}
      <Box
        sx={{
          display: 'flex',
          paddingX: '16px',
          borderBottom: '1px solid gray',
        }}
      >
        {/* ログインログアウト切り替え */}
        {/* {!!firebaseUser ? ( */}
        <Box sx={{ marginLeft: 'auto' }}>
          <Button onClick={logout}>ログアウト</Button>
        </Box>
        {/* ) : ( */}
        <Box sx={{ display: 'flex', marginLeft: 'auto', gap: '8px' }}>
          <Link href="/login" passHref>
            <Button>ログイン</Button>
          </Link>
          <Link href="/register" passHref>
            <Button>新規会員登録</Button>
          </Link>
        </Box>
        {/* )} */}
        <Link href="/profile" passHref>
          <Button>プロフィール</Button>
        </Link>
      </Box>
      {/* メインコンテンツ */}
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {/* カレンダー */}
        <Box sx={{ padding: '25px', width: '50%' }}>
          <NeneCalendar setEventId={setEventId} />
        </Box>
        {/* イベント詳細 */}
        <Box sx={{ padding: '25px', width: '50%' }}>
          {!!eventId && <Event eventId={eventId} />}
        </Box>
      </Box>
    </Box>
  );
};
