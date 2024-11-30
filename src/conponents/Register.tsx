import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';
import { useState } from 'react';
import { cookieOptions } from '@/constants/cookieOptions';
import { setCookie } from 'cookies-next';

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
        // ユーザー登録ができたかどうかをわかりやすくするためのアラート
        alert('登録完了！');
        console.log(user);
        user.getIdToken().then((token) => {
          setCookie('token', token, cookieOptions); //'key', value, options
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1>新規登録</h1>
      {/* <div>
        <Form>
          <FormGroup>
            <Label>メールアドレス：</Label>
            <Input
              type="email"
              name="email"
              style={{ height: 50, fontSize: '1.2rem' }}
              // onChangeでユーザーが入力した値を取得し、その値をemailに入れる
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>パスワード：</Label>
            <Input
              type="password"
              name="password"
              style={{ height: 50, fontSize: '1.2rem' }}
              // onChangeでユーザーが入力した値を取得し、その値をpasswordに入れる
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          <Button
            style={{ width: 220 }}
            color="primary"
            // 登録ボタンがクリックされたときdoRegister関数が実行されるようにする
            onClick={() => {
              doRegister();
            }}
          >
            登録
          </Button>
        </Form>
      </div> */}
    </div>
  );
};
