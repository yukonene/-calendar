import { TextField, TextFieldProps } from '@mui/material';
import { HTMLInputTypeAttribute } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

type Props<T extends FieldValues> = {
  control: Control<T, any>;
  name: FieldPath<T>;
  label: string;
  type?: HTMLInputTypeAttribute | undefined;
};

//<>内はタイプ
export const TextFieldRHF = <T extends FieldValues>(props: Props<T>) => {
  const { control, name, label, type } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <TextField
            ref={field.ref}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={field.disabled}
            label={label}
            type={type}
            variant="standard"
            fullWidth
            helperText={error?.message}
            error={!!error}
          />
        );
      }}
    />
  );
};
