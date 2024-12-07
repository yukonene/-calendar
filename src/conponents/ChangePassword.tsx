import { auth } from '@/lib/firebase/firebaseClient';
import { Alert, Box, Button, Snackbar, TextField } from '@mui/material';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FormEvent, useState } from 'react';

export const ChangePassword = () => {
  const [email, setEmail] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<{
    severity: 'success' | 'error';
    text: string;
  }>({ severity: 'error', text: '' });
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const changePassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!!email) {
      sendPasswordResetEmail(auth, email) //パスワード変更の為のメールを送る
        .then(() => {
          setIsSnackbarOpen(true);
          setSnackbarMessage({
            severity: 'success',
            text: 'メールを送信しました。',
          });
        })
        .catch(() => {
          setIsSnackbarOpen(true);
          setSnackbarMessage({
            severity: 'error',
            text: 'メールの送信に失敗しました。',
          });
        });
    } else {
      setIsSnackbarOpen(true);
      setSnackbarMessage({
        severity: 'error',
        text: 'メールアドレスを入力してください。',
      });
      return;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setIsSnackbarOpen(false)}
          severity={snackbarMessage.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage.text}
        </Alert>
      </Snackbar>
      <Box
        component="form"
        onSubmit={changePassword}
        sx={{
          width: '350px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          border: '1px solid gray',
          borderRadius: '5px',
          padding: '32px',
        }}
      >
        <Box component="h4" sx={{ marginBottom: '20px' }}>
          パスワード変更
        </Box>
        <TextField
          label="メールアドレス"
          variant="standard"
          fullWidth
          onChange={(e) => setEmail(e.target.value)} //中身の変更
          value={email} //表示
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ width: '200px', marginTop: '16px' }}
        >
          送信
        </Button>
      </Box>
    </Box>
  );
};
