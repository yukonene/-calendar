import { auth } from '@/lib/firebase/firebaseAdminClient';
import { Box, Button } from '@mui/material';
import { sendEmailVerification } from 'firebase/auth';

export default function SendConfirmationEmailPage() {
  // const resendEmail = () => {
  //   auth.verifyIdToken
  //     sendEmailVerification(user);})
  // };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '36px',
      }}
    >
      <Box>確認メールを送信しました。</Box>
      <Box>メール認証をお願いします。</Box>
      {/* <Button onClick={resendEmail}>確認メールの再送信</Button> */}
    </Box>
  );
}
