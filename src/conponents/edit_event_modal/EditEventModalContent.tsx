import * as React from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
  PostEventRequestBody,
  PostEventResponseSuccessBody,
} from '@/pages/api/events';
import { format } from 'date-fns';
import { Dispatch, SetStateAction } from 'react';
import { TextFieldRHF } from '../common/TextFieldRHF';
import { DatePickerRHF } from '../common/DatePickerRHF';
import { PatchEventRequestBody } from '@/pages/api/events/[id]';

const style = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  bgcolor: 'background.paper',

  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const eventScheme = z
  .object({
    title: z
      .string()
      .min(1, { message: 'イベントタイトルを入力してください' })
      .max(50, { message: 'イベントタイトルが長すぎます' }),
    startDateTime: z.date(),
    endDateTime: z.date().nullable(), //nullかも
    place: z.string().max(100, { message: '文字数超過' }).nullable(),
    url: z.string().max(200, { message: '文字数超過' }).nullable(),
    member: z.string().max(100, { message: '文字数超過' }).nullable(),
    memo: z.string().max(255, { message: '文字数超過' }).nullable(),
    diary: z.string().max(10000, { message: '文字数超過' }).nullable(),
    success: z.boolean().nullable(),
  })
  .refine(
    //終了日時がnull、もしくは(||)終了時刻が開始日時より後の場合正しい入力値とする。
    (data) => !data.endDateTime || data.startDateTime <= data.endDateTime,
    {
      message: '終了日時は開始日時の後に設定してください',
      path: ['endDateTime'],
    }
  );
type EventSchemaType = z.infer<typeof eventScheme>;

type Props = {
  onClose: () => void;
  event: {
    id: number;
    title: string;
    startDateTime: string;
    endDateTime: string | null;
    place: string | null;
    url: string | null;
    member: string | null;
    memo: string | null;
    diary: string | null;
    success: true | null;
  };
  getEvent: () => void;
  setIsSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  setSnackbarMessage: Dispatch<
    SetStateAction<{
      severity: 'success' | 'error';
      text: string;
    }>
  >;
};

export const EditEventModalContent = ({
  onClose,
  event,
  getEvent,
  setSnackbarMessage,
  setIsSnackbarOpen,
}: Props) => {
  const {
    //何を使うか
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EventSchemaType>({
    //<型>(中身：オブジェクトの形)
    resolver: zodResolver(eventScheme),
    mode: 'onSubmit',
    criteriaMode: 'all',
    defaultValues: {
      title: event.title,
      startDateTime: new Date(event.startDateTime),
      endDateTime: event.endDateTime ? new Date(event.endDateTime) : null,
      place: event.place,
      url: event.url,
      member: event.member,
      memo: event.memo,
      diary: event.diary,
      success: event.success,
    },
  });
  console.log(errors);

  const onEditNewEvent = (data: EventSchemaType) => {
    const postData: PatchEventRequestBody = {
      title: data.title,
      startDateTime: data.startDateTime.toISOString(),
      endDateTime: data.endDateTime?.toISOString() || null,
      place: data.place || null,
      url: data.url || null,
      member: data.member || null,
      memo: data.memo || null,
      diary: data.diary || null,
      success: data.success || null,
    };

    axios
      .post<PostEventResponseSuccessBody>('/api/events', postData) //POSTする
      .then(() => {
        setSnackbarMessage({
          severity: 'success',
          text: 'イベント登録完了',
        });
        getEvents();
        setIsSnackbarOpen(true);
        onClose();
      })
      .catch((error) => {
        setSnackbarMessage({
          severity: 'error',
          text: 'イベントの登録に失敗しました。',
        });
        setIsSnackbarOpen(true);
      });
  };

  return (
    <Box //全体
      sx={{ ...style, width: '600px' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box component="h3">{format(date, ' MM月dd日')}</Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onCreateNewEvent)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            padding: '32px',
            width: '100%',
          }}
        >
          <TextFieldRHF<EventSchemaType>
            control={control}
            name="title"
            label="イベントタイトル"
          />
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <DatePickerRHF<EventSchemaType>
              name="startDateTime"
              control={control}
              label="開催日時"
            />
            <Box>-</Box>
            <DatePickerRHF<EventSchemaType>
              name="endDateTime"
              control={control}
              label="終了日時"
            />
          </Box>
          <TextFieldRHF<EventSchemaType>
            control={control}
            name="place"
            label="開催場所"
          />
          <TextFieldRHF<EventSchemaType>
            control={control}
            name="url"
            label="イベントページURL"
            // リンクつける
          />
          <TextFieldRHF<EventSchemaType>
            control={control}
            name="member"
            label="同行メンバー"
          />
          <TextFieldRHF<EventSchemaType>
            control={control}
            name="memo"
            label="詳細memo"
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button
              onClick={onClose}
              variant="contained"
              sx={{
                width: '100px',
                marginTop: '16px',
                fontSize: 'small',
                backgroundColor: 'gray',
                color: 'white',
                margin: '8px',
              }}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ width: '150px', marginTop: '16px', margin: '8px' }}
            >
              登録
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
