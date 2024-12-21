import { auth } from '@/lib/firebase/firebaseClient';
import { Alert, Box, Button, Snackbar, TextField } from '@mui/material';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FormEvent, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { TextFieldRHF } from './common/TextFieldRHF';

const changePasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'メールアドレスを入力してください' })
    .email({ message: '正しいメールアドレスの形式で入力してください。' }),
});

type ChangePasswordFormSchemaType = z.infer<typeof changePasswordFormSchema>;

export const ChangePassword = () => {
  const {
    //何を使うか
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormSchemaType>({
    //<型>(中身：オブジェクトの形)
    mode: 'onSubmit',
    criteriaMode: 'all',
    defaultValues: {
      email: '',
    },
  });

  const [snackbarMessage, setSnackbarMessage] = useState<{
    severity: 'success' | 'error';
    text: string;
  }>({ severity: 'error', text: '' });
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const changePassword = (data: ChangePasswordFormSchemaType) => {
    sendPasswordResetEmail(auth, data.email) //パスワード変更の為のメールを送る
      .then(() => {
        setIsSnackbarOpen(true);
        setSnackbarMessage({
          severity: 'success',
          text: 'メールを送信しました。',
        });
      })
      .catch(() => {
        setIsSnackbarOpen(true);
        setSnackbarMessage({
          severity: 'error',
          text: 'メールの送信に失敗しました。',
        });
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
        open={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setIsSnackbarOpen(false)}
          severity={snackbarMessage.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage.text}
        </Alert>
      </Snackbar>
      <Box
        component="form"
        onSubmit={handleSubmit(changePassword)}
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
        <Box component="h4" sx={{ marginBottom: '20px' }}>
          パスワード変更
        </Box>
        <TextFieldRHF<ChangePasswordFormSchemaType>
          control={control}
          name="email"
          label="メールアドレス"
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ width: '200px', marginTop: '16px' }}
        >
          送信
        </Button>
      </Box>
    </Box>
  );
};
