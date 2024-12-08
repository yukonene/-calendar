import { Controller, useForm } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
};

export default function App() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    criteriaMode: 'all',
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const handleOnSubmit = (data: FormData) => console.log(data);
  const handleOnError = (errors: any) => console.log(errors);

  return (
    <form onSubmit={handleSubmit(handleOnSubmit, handleOnError)}>
      <div>
        <label htmlFor="name">名前: </label>
        {/* <input
          {...register('name', {
            required: '名前を入力してください',
          })}
          type="text"
        /> */}
        {/* 上と下は同じ意味 */}
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <input
              ref={field.ref}
              name={field.name}
              value={field.value}
              onChange={field.onChange} // send value to hook form
              onBlur={field.onBlur} // notify when input is touched/blur
              disabled={field.disabled}
            />
          )}
        />
        {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="name">メールアドレス: </label>
        <input
          {...register('email', {
            required: 'メールアドレスを入力してください',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '正しいメールアドレスの形式で入力してください。',
            },
          })}
          type="text"
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
      </div>

      <button type="submit">送信</button>
    </form>
  );
}
