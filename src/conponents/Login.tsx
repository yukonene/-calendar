import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Link from 'next/link';

export const Login = () => {
  const [input, setInput] = React.useState('');

  const [inputError, setInputError] = React.useState(false);
  const onChangeInput = (event) => {
    setInput(event.target.value);
    if (event.target.value) {
      setInputError(false);
    }
  };
  const onBlurInput = (event) => {
    //TextFieldからフォーカスが離れたときに実行する関数
    if (!event.target.value) {
      setInputError(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //ログインする
  };
  return (
    <div>
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            required
            id="standard-required"
            label="メールアドレス"
            variant="standard"
            onChange={onChangeInput}
            onBlur={onBlurInput}
            error={inputError}
            helperText={inputError ? '入力してください' : ''}
          />
          <p>{input}</p>
          <TextField
            required
            id="outlined-required"
            label="パスワード"
            variant="standard"
            onChange={onChangeInput}
            //   onBlur={onBlurInput}
            //   error={inputError}
            helperText={inputError ? '入力してください' : ''}
          />
        </div>

        <button type="submit">ログイン</button>
      </Box>
      <Link href="/changePassword">パスワードを忘れた方はこちら</Link>
    </div>
  );
};
