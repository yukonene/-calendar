import { auth } from '@/lib/firebase/firebaseAdminClient';
import { Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { FirebaseError } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { FormEvent, useState } from 'react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const login = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //formのonsubmitのデフォルトの動作を強制的にストップする
    if (!!email) {
      setEmailError('');
    } else {
      setEmailError('メールアドレスを入力して下さい。');
      return;
    }
    if (!!password) {
      setPasswordError('');
    } else {
      setPasswordError('パスワードを入力して下さい。');
      return;
    }
    if (!password) {
      setPasswordError('');
    } else {
      setPasswordError('メールアドレスかパスワードを間違えています。');
      return;
    }

    const signIn = async () => {
      try {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password);
      } catch (e) {
        if (e instanceof FirebaseError) {
          console.log(e);
        }
      }
    };
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '350px',
        }}
      >
        <Box component="h1" sx={{ paddingBottom: '32px' }}>
          {process.env.NEXT_PUBLIC_APP_TITLE}
        </Box>
        <Box
          component="form"
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
          <Box component="h4">ログイン</Box>
          <Box>
            <TextField
              label="メールアドレス"
              variant="standard"
              fullWidth
              onChange={(e) => setEmail(e.target.value)} //中身の変更
              value={email} //表示
              helperText={emailError}
              error={!!emailError}
            />

            <TextField
              label="パスワード"
              variant="standard"
              type="password"
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              helperText={passwordError}
              error={!!passwordError}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            sx={{ width: '200px', marginTop: '16px' }}
          >
            ログイン
          </Button>
        </Box>

        <Link
          href="/changePassword"
          style={{ width: '230px', marginTop: '16px' }}
        >
          パスワードを忘れた方はこちら
        </Link>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Button sx={{ marginLeft: 'auto' }}>登録済の方はこちら</Button>
        </Box>
      </Box>
    </Box>
  );
};
