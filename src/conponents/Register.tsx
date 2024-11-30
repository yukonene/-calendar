import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';
import { useState } from 'react';
import { cookieOptions } from '@/constants/cookieOptions';
import { setCookie } from 'cookies-next';
import axios from 'axios';
import { Box, Button, TextField } from '@mui/material';

export const Register = () => {
  // useStateでユーザーが入力したメールアドレスとパスワードをemailとpasswordに格納する
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ユーザーが登録ボタンを押したときにdoRegister関数が実行される
  const doRegister = () => {
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
        console.log(error);
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '350px',
        }}
      >
        <Box component="h1" sx={{ paddingBottom: '32px' }}>
          title
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
          <Box component="h4">新規会員登録</Box>
          <TextField label="メールアドレス" variant="standard" fullWidth />
          <TextField
            label="パスワード"
            variant="standard"
            type="password"
            fullWidth
          />
          <TextField
            label="パスワード確認"
            variant="standard"
            type="password"
            fullWidth
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
