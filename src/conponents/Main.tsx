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
    <Box //全体の
      style={{
        position: 'relative',
        display: 'inlineFlex',
      }}
    >
      <Box>
        <Button onClick={logout}>ログアウト</Button>
      </Box>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <NeneCalendar />
        </Box>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          日ごと
        </Box>
      </Box>
    </Box>
  );
};
