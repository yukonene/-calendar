import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/firebaseClient';
import { cookieOptions } from '@/constants/cookieOptions';
import { setCookie } from 'cookies-next';
import { Box, Button } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextFieldRHF } from '../../components/forms/TextFieldRHF';
import { useSnackbarContext } from '../../providers/SnackbarProvider';
import { postUser } from '@/apis/users/postUser';

const registerFormSchema = z
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
    passwordConfirmation: z
      .string()
      .min(8, { message: '8桁以上のパスワードを入力してください' })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: '英大文字、英小文字、数字で入力してください',
      }),
  }) //個々の設定↑　↓複合設定
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'パスワードと確認用パスワードが一致しません',
    path: ['passwordConfirmation'],
  });
type RegisterFormSchemaType = z.infer<typeof registerFormSchema>;

export const Register = () => {
  const { setSnackbarMessage, setIsSnackbarOpen } = useSnackbarContext();

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
  } = useForm<RegisterFormSchemaType>({
    //<型>(中身：オブジェクトの形)
    resolver: zodResolver(registerFormSchema),
    mode: 'onSubmit',
    criteriaMode: 'all',
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const router = useRouter();

  // ユーザーが登録ボタンを押したときにdoRegister関数が実行される
  const register = (data: RegisterFormSchemaType) => {
    // e.preventDefault(); //formのonsubmitのデフォルトの動作を強制的にストップする
    //↑↑再レンダリングされないから要らないくなった。

    //↓↓zodで書き換えたからいらない
    // if (data.password !== data.passwordConfirmation) {
    //   setSnackbarError({
    //     severity: 'error',
    //     text: 'パスワードが一致しません。',
    //   });
    //   setIsSnackbarErrorOpen(true);
    //   return;
    // }
    const postData = {
      email: data.email,
      password: data.password,
      passwordConfirmation: data.passwordConfirmation,
    };
    // Firebaseで用意されているユーザー登録の関数
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // ユーザー登録すると自動的にログインされてuserCredential.userでユーザーの情報を取得できる
        const user = userCredential.user;
        user
          .getIdToken() //トークン取得
          .then((token) => {
            setCookie('token', token, cookieOptions); //'key', value, options
            postUser(postData)
              .then(() => {
                sendEmailVerification(user)
                  .then(() => {
                    //確認メールの送信に成功したら
                    router.push('/sendConfirmationEmail');
                  }) //↓ここからエラー文
                  .catch((error) => {
                    setSnackbarMessage({
                      severity: 'error',
                      text: '確認メールの送信に失敗しました。',
                    });
                    setIsSnackbarOpen(true);
                  });
              })
              .catch((error) => {
                //サーバー側で発生したエラーをキャッチして、snackbarにエラー文載せて表示
                console.log(error);
                setSnackbarMessage({
                  severity: 'error',
                  text: error.response.data.error,
                });
                setIsSnackbarOpen(true);
              });
          });
      })
      .catch((error) => {
        if (error instanceof FirebaseError) {
          // 例　{"code":"auth/email-already-in-use","customData":{"appName":"[DEFAULT]","_tokenResponse":{"error":{"code":400,"message":"EMAIL_EXISTS","errors":[{"message":"EMAIL_EXISTS","domain":"global","reason":"invalid"}]}}},"name":"FirebaseError"}
          //エラーがfirebaseに関連したものであれば
          // console.log(JSON.stringify(error));
          if (error.code === 'auth/email-already-in-use') {
            // do something
            setSnackbarMessage({
              severity: 'error',
              text: 'すでに登録されているメールアドレスです。',
            });
            setIsSnackbarOpen(true);
          }
        } else {
          setSnackbarMessage({
            severity: 'error',
            text: 'アカウントの作成に失敗しました。',
          });
          setIsSnackbarOpen(true);
          // console.log(JSON.stringify(error));
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
          <TextFieldRHF<RegisterFormSchemaType>
            control={control}
            name="email"
            label="メールアドレス"
          />
          <TextFieldRHF<RegisterFormSchemaType>
            control={control}
            name="password"
            label="パスワード"
            type="password"
          />
          <TextFieldRHF<RegisterFormSchemaType>
            control={control}
            name="passwordConfirmation"
            label="パスワード確認"
            type="password"
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
