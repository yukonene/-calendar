import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebaseClient';
import { FormEvent, useState } from 'react';
import { cookieOptions } from '@/constants/cookieOptions';
import { setCookie } from 'cookies-next';
import axios from 'axios';
import { Box, Button, Snackbar, TextField } from '@mui/material';
import { FirebaseError } from 'firebase/app';

export const Register = () => {
  // useStateでユーザーが入力したメールアドレスとパスワードをemailとpasswordに格納する
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState('');
  // const [snackbarError, setSnackbarError] = useState('');
  // const [isSnackbarErrorOpen, setIsSnackbarErrorOpen] = useState(false);

  // ユーザーが登録ボタンを押したときにdoRegister関数が実行される
  const register = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //formのonsubmitのデフォルトの動作を強制的にストップする
    if (!!email) {
      setEmailError('');
    } else {
      setEmailError('メールアドレスを入力して下さい。');
      return;
    }

    const emailRegex =
      /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;
    if (emailRegex.test(email)) {
      //emailが正規表現に適合しているかtest
      setEmailError('');
    } else {
      setEmailError('メールアドレスが間違っています。');
      return;
    }

    if (!!password) {
      setPasswordError('');
    } else {
      setPasswordError('パスワードを入力して下さい。');
      return;
    }
    if (password.length > 7) {
      setPasswordError('');
    } else {
      setPasswordError('パスワードが短すぎます。');
      return;
    }
    if (!!passwordConfirmation) {
      setPasswordConfirmationError('');
    } else {
      setPasswordConfirmationError('パスワードを入力して下さい。');
      return;
    }
    if (password === passwordConfirmation) {
      setPasswordConfirmationError('');
    } else {
      setPasswordConfirmationError('パスワードが一致しません。');
      return;
    }
    // Firebaseで用意されているユーザー登録の関数
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // ユーザー登録すると自動的にログインされてuserCredential.userでユーザーの情報を取得できる
        const user = userCredential.user;
        console.log(user);
        user.getIdToken().then((token) => {
          setCookie('token', token, cookieOptions); //'key', value, options
          axios.post('/api/users').then(() => {
            console.log('response');
          });
        });
      })
      .catch((error) => {
        if (error instanceof FirebaseError) {
          // 例　{"code":"auth/email-already-in-use","customData":{"appName":"[DEFAULT]","_tokenResponse":{"error":{"code":400,"message":"EMAIL_EXISTS","errors":[{"message":"EMAIL_EXISTS","domain":"global","reason":"invalid"}]}}},"name":"FirebaseError"}
          //エラーがfirebaseに関連したものであれば
          console.log(JSON.stringify(error));
          if (error.code === 'auth/email-already-in-use') {
            // do something
            setEmailError('すでに登録されているメールアドレスです。');
          }
        } else {
          setEmailError('アカウントの作成に失敗しました。');
          console.log(JSON.stringify(error));
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
      {/* <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isSnackbarErrorOpen}
        onClose={() => setIsSnackbarErrorOpen(false)}
        message="I love snacks"
      /> */}
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
          onSubmit={register}
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
          <Box component="h4">新規会員登録</Box>
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
          <TextField
            label="パスワード確認"
            variant="standard"
            type="password"
            fullWidth
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            value={passwordConfirmation}
            helperText={passwordConfirmationError}
            error={!!passwordConfirmationError}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ width: '200px', marginTop: '16px' }}
          >
            登録
          </Button>
        </Box>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Button sx={{ marginLeft: 'auto' }}>ログインはこちら</Button>
        </Box>
      </Box>
    </Box>
  );
};
