import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/firebaseClient';
import { FormEvent, useState } from 'react';
import { cookieOptions } from '@/constants/cookieOptions';
import { setCookie } from 'cookies-next';
import axios from 'axios';
import { Alert, Box, Button, Snackbar, TextField } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

export const Register = () => {
  // useStateでユーザーが入力したメールアドレスとパスワードをemailとpasswordに格納する
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [passwordConfirmation, setPasswordConfirmation] = useState('');

  // const [emailError, setEmailError] = useState('');
  // const [passwordError, setPasswordError] = useState('');
  // const [passwordConfirmationError, setPasswordConfirmationError] =
  //   useState('');
  //↓↓useFormで書き換え
  const {
    //何を使うか
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    //<型>(中身：オブジェクトの形)
    mode: 'onSubmit',
    criteriaMode: 'all',
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });
  console.log(errors);
  const [snackbarError, setSnackbarError] = useState<{
    severity: 'success' | 'error';
    text: string;
  }>({ severity: 'error', text: '' });
  const [isSnackbarErrorOpen, setIsSnackbarErrorOpen] = useState(false);

  const router = useRouter();

  // ユーザーが登録ボタンを押したときにdoRegister関数が実行される
  const register = (data: FormData) => {
    // e.preventDefault(); //formのonsubmitのデフォルトの動作を強制的にストップする
    //↑↑再レンダリングされないから要らないくなった。
    if (data.password !== data.passwordConfirmation) {
      setSnackbarError({
        severity: 'error',
        text: 'パスワードが一致しません。',
      });
      setIsSnackbarErrorOpen(true);
      return;
    }
    // Firebaseで用意されているユーザー登録の関数
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // ユーザー登録すると自動的にログインされてuserCredential.userでユーザーの情報を取得できる
        const user = userCredential.user;
        console.log(user);
        user
          .getIdToken() //トークン取得
          .then((token) => {
            setCookie('token', token, cookieOptions); //'key', value, options
            axios
              .post('/api/users')
              .then(() => {
                sendEmailVerification(user)
                  .then(() => {
                    //確認メールの送信に成功したら
                    console.log('確認メールを送信しました');
                    router.push('/sendConfirmationEmail');
                  }) //↓ここからエラー文
                  .catch((error) => {
                    console.log('確認メールの送信に失敗しました。');
                    setSnackbarError({
                      severity: 'error',
                      text: '確認メールの送信に失敗しました。',
                    });
                    setIsSnackbarErrorOpen(true);
                  });
              })
              .catch((error) => {
                //サーバー側で発生したエラーをキャッチして、snackbarにエラー文載せて表示
                console.log(error);
                setSnackbarError({
                  severity: 'error',
                  text: error.response.data.error,
                });
                setIsSnackbarErrorOpen(true);
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
            setSnackbarError({
              severity: 'error',
              text: 'すでに登録されているメールアドレスです。',
            });
            setIsSnackbarErrorOpen(true);
          }
        } else {
          setSnackbarError({
            severity: 'error',
            text: 'アカウントの作成に失敗しました。',
          });
          setIsSnackbarErrorOpen(true);
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
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isSnackbarErrorOpen}
        onClose={() => setIsSnackbarErrorOpen(false)}
      >
        <Alert
          onClose={() => setIsSnackbarErrorOpen(false)}
          severity={snackbarError.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarError.text}
        </Alert>
      </Snackbar>
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
          onSubmit={handleSubmit(register)}
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
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'メールアドレスを入力してください。',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '正しいメールアドレスの形式で入力してください。',
              },
            }}
            render={({ field }) => (
              <TextField
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={field.disabled}
                label="メールアドレス"
                variant="standard"
                fullWidth
                helperText={errors.email?.message}
                error={!!errors.email}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            rules={{ required: 'パスワードを入力してください。' }}
            render={({ field }) => (
              <TextField
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={field.disabled}
                label="パスワード"
                type="password"
                variant="standard"
                fullWidth
                helperText={errors.password?.message}
                error={!!errors.password}
              />
            )}
          />
          <Controller
            control={control}
            name="passwordConfirmation"
            rules={{ required: 'パスワードを入力してください。' }}
            render={({ field }) => (
              <TextField
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={field.disabled}
                label="パスワード確認"
                type="password"
                variant="standard"
                fullWidth
                helperText={errors.passwordConfirmation?.message}
                error={!!errors.passwordConfirmation}
              />
            )}
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
          <Button href="/login" sx={{ marginLeft: 'auto' }}>
            ログインはこちら
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
