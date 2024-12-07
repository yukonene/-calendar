import { cookieOptions } from '@/constants/cookieOptions';
import { Button, Snackbar, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/lib/firebase/firebaseClient';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSnackbarErrorOpen, setIsSnackbarErrorOpen] = useState(false);
  const router = useRouter();

  const login = (e: FormEvent<HTMLFormElement>) => {
    console.log('0');
    e.preventDefault(); //formのonsubmitのデフォルトの動作を強制的にストップする
    console.log('1');
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

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        user
          .getIdToken() //トークン取得
          .then((token) => {
            setCookie('token', token, cookieOptions); //'key', value, options
            axios
              .get('/api/login')
              .then(() => {
                console.log('response');
                router.push('/');
              })
              .catch((error) => {
                //サーバー側で発生したエラーをキャッチして、snackbarにエラー文載せて表示
                console.log(error);
                setLoginError(error.response.data.error);
                setIsSnackbarErrorOpen(true);
              });
          });
        // ...
      })
      .catch((error) => {
        if (error instanceof FirebaseError) {
          // 例　{"code":"auth/email-already-in-use","customData":{"appName":"[DEFAULT]","_tokenResponse":{"error":{"code":400,"message":"EMAIL_EXISTS","errors":[{"message":"EMAIL_EXISTS","domain":"global","reason":"invalid"}]}}},"name":"FirebaseError"}
          //エラーがfirebaseに関連したものであれば
          console.log(JSON.stringify(error));
          if (error.code === 'auth/user-not-found') {
            // do something
            setLoginError('認証に失敗しました。');
          }
        }
      });
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
        open={isSnackbarErrorOpen}
        onClose={() => setIsSnackbarErrorOpen(false)}
        message={loginError}
      />
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
          onSubmit={login}
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
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Link
            href="/changePassword"
            style={{ width: '230px', marginTop: '16px', marginLeft: 'auto' }}
          >
            パスワードを忘れた方はこちら
          </Link>
        </Box>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Link
            href="/register"
            style={{ marginLeft: 'auto', fontSize: 'small', marginTop: '7px' }}
          >
            新規会員登録
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
