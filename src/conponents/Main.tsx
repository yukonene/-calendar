import { Box, Button } from '@mui/material';
import { NeneCalendar } from './Calendar';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebaseClient';

export const Main = () => {
  const logout = () => {
    auth.signOut();
    console.log('signout');
  };
  return (
    <Box
      style={{
        position: 'relative',
        display: 'inlineFlex',
      }}
    >
      <Button onClick={logout}>ログアウト</Button>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <NeneCalendar />
        </Box>
      </Box>
    </Box>
  );
};
