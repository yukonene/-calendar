import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export const ChangePassword = () => {
  const [mail, setMail] = React.useState('');
  const [input, setInput] = React.useState('');

  const [inputError, setInputError] = React.useState(false);
  const onChangeInput = (event) => {
    setInput(event.target.value);
    if (event.target.value) {
      setInputError(false);
    }
  };
  const onBlurInput = (event) => {
    if (!event.target.value) {
      setInputError(true);
    }
  };

  return (
    <form
      style={{
        position: 'relative',
      }}
    >
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
      <button
        type="submit"
        style={{
          position: 'absolute',
          height: '60%',
          width: '10%',
          top: '120%',
        }}
      >
        送信
      </button>
    </form>
  );
};
