import React from 'react';

import TextField from '@mui/material/TextField';

export const ChangePassword = () => {
  const [mail, setMail] = React.useState('');
  const [input, setInput] = React.useState('');

  const [inputError, setInputError] = React.useState(false);
  const onChangeInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput(event.target.value);
    if (event.target.value) {
      setInputError(false);
    }
  };
  const onBlurInput = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) => {
    if (!event.target.value) {
      setInputError(true);
    }
  };

  return (
    <form>
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
      </div>
      <div>
        <button type="submit">送信</button>
      </div>
    </form>
  );
};
