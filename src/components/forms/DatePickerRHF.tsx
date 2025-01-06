import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ja } from 'date-fns/locale/ja';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

type Props<T extends FieldValues> = {
  control: Control<T, any>; // eslint-disable-line
  name: FieldPath<T>;
  label: string;
};

//<>内はタイプ
export const DatePickerRHF = <T extends FieldValues>(props: Props<T>) => {
  const { control, name, label } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <DateTimePicker
              ref={field.ref}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              disabled={field.disabled}
              format={'M月d日 H:m'}
              views={['month', 'day', 'hours', 'minutes']}
              ampm={false}
              viewRenderers={{
                // hours: null,
                // minutes: null,
                seconds: null,
              }}
              slotProps={{
                textField: {
                  helperText: error?.message,
                  error: !!error,
                },
              }}
              label={label}
            />
          </LocalizationProvider>
        );
      }}
    />
  );
};
