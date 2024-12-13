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
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginFormSchema = z //zod
  .object({
    email: z
      .string()
      .min(1, { message: 'メールアドレスを入力してください' })
      .email({ message: '正しいメールアドレスの形式で入力してください。' }),

    password: z
      .string()
      .min(8, { message: '8桁以上のパスワードを入力してください' })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: '英大文字、英小文字、数字で入力してください',
      }),
  });
type LoginFormSchemaType = z.infer<typeof loginFormSchema>;

export const Login = () => {
  const {
    //何を使うか
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchemaType>({
    //<型>(中身：オブジェクトの形)
    resolver: zodResolver(loginFormSchema),
    mode: 'onSubmit',
    criteriaMode: 'all',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  console.log(errors);
  const [loginError, setLoginError] = useState('');
  const [isSnackbarErrorOpen, setIsSnackbarErrorOpen] = useState(false);
  const router = useRouter();
  console.log(0);
  const login = (data: LoginFormSchemaType) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
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
          onSubmit={handleSubmit(login)}
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
                  onChange={field.onChange} // send value to hook form
                  onBlur={field.onBlur} // notify when input is touched/blur
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
              render={({ field }) => (
                <TextField
                  ref={field.ref}
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange} // send value to hook form
                  onBlur={field.onBlur} // notify when input is touched/blur
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
