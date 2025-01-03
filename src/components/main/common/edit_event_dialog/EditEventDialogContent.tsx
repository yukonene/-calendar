import * as React from 'react';
import Box from '@mui/material/Box';
import {
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { z } from 'zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from '@/constants/imageSetting';
import { TextFieldRHF } from '../../../common/TextFieldRHF';
import { DatePickerRHF } from '../../../common/DatePickerRHF';
import {
  PatchEventRequestBody,
  PatchEventResponseSuccessBody,
  PostEventPhotoGenerateSignedUrlsRequestBody,
  PostEventPhotoGenerateSignedUrlsResposeSuccessBody,
} from '@/pages/api/events/[id]';
import { EventT } from '@/types/EventT';
import { useSnackbarContext } from '@/components/common/SnackbarProvider';
import { EventPhoto } from './EventPhoto';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { EventPhotoT } from '@/types/EventPhotoT';
import { useRef, useState } from 'react';

import { PostGenerateSignedUrlsResposeSuccessBody } from '@/pages/api/generateSignedUrls';

const eventScheme = z.object({
  event: z
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
      success: z.union([z.literal('true'), z.literal('false')]).nullable(),
      //literal・・・文字通りの　union・・・orの意味　typescriptの|
      //radiocomponentでvalueがstringのみ使用可能だった為、一度string型に。
    })
    .refine(
      //終了日時がnull、もしくは(||)終了時刻が開始日時より後の場合正しい入力値とする。
      (data) => !data.endDateTime || data.startDateTime <= data.endDateTime,
      {
        message: '終了日時は開始日時の後に設定してください',
        path: ['endDateTime'],
      }
    ),

  eventPhotos: z
    .instanceof(File)
    .nullable()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'ファイルサイズを30MB以内にしてください')
    .refine((file) => {
      return !file || ACCEPTED_FILE_TYPES.includes(file.type);
    }, '画像ファイルのみアップロードできます')
    .array(),
  //.array()をつける事によって、中身が配列に　　↑↑ })
});
export type EventSchemaType = z.infer<typeof eventScheme>;

type Props = {
  onClose: () => void;
  event: EventT;
  afterSaveEvent: () => void;
  eventPhotos: EventPhotoT[];
};

export const EditEventDialogContent = ({
  onClose,
  event,
  afterSaveEvent,
  eventPhotos,
}: Props) => {
  const {
    //何を使うか
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EventSchemaType>({
    //<型>(中身：オブジェクトの形)
    resolver: zodResolver(eventScheme),
    mode: 'onSubmit',
    criteriaMode: 'all',
    defaultValues: {
      event: {
        title: event.title,
        startDateTime: new Date(event.startDateTime),
        endDateTime: event.endDateTime ? new Date(event.endDateTime) : null,
        place: event.place,
        url: event.url,
        member: event.member,
        memo: event.memo,
        diary: event.diary,
        //boolean型に戻した↓
        success:
          event.success === null
            ? null
            : (event.success.toString() as 'true' | 'false'),
      },
      eventPhotos: [null], //ファイルの初期値はnullにすること
    },
  });

  const { setSnackbarMessage, setIsSnackbarOpen } = useSnackbarContext();
  const [isLoading, setIsLoading] = useState(false);

  const onEditEvent = async (data: EventSchemaType) => {
    setIsLoading(true);
    try {
      let fileKey = null;
      let filename = null;
      if (data.eventPhotos.length > 0 && !!data.eventPhotos[0]) {
        //signedURLの取得
        const postData: PostEventPhotoGenerateSignedUrlsRequestBody = {
          uploadLength: 1,
        };
        const res =
          await axios.post<PostEventPhotoGenerateSignedUrlsResposeSuccessBody>(
            '/api/generateSignedUrls',
            postData
          );
        fileKey = res.data.uploads[0].fileKey;
        //fileにnameをつけるとファイルの名前がとれる決まり
        filename = data.eventPhotos[0].name;

        //取得したURLを使ってＧＣＳにファイルをPUTする
        await axios.put(res.data.uploads[0].signedGcsUrl, data.eventPhotos[0], {
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        });
      }

      const patchData: PatchEventRequestBody = {
        event: {
          title: data.event.title,
          startDateTime: data.event.startDateTime.toISOString(),
          endDateTime: data.event.endDateTime?.toISOString() || null,
          place: data.event.place || null,
          url: data.event.url || null,
          member: data.event.member || null,
          memo: data.event.memo || null,
          diary: data.event.diary || null,
          success:
            data.event.success === null
              ? null
              : data.event.success === 'true'
              ? true
              : false,
        },
        eventPhotos:
          !!fileKey && !!filename
            ? [
                {
                  fileKey: fileKey,
                  originalFileName: filename,
                },
              ]
            : [],
      };

      await axios.patch<PatchEventResponseSuccessBody>(
        `/api/events/${event.id}`,
        patchData
      ); //patchする
      setSnackbarMessage({
        severity: 'success',
        text: 'イベント編集完了',
      });
      setIsLoading(false);
      afterSaveEvent();
      setIsSnackbarOpen(true);
      onClose();
    } catch (error) {
      setSnackbarMessage({
        severity: 'error',
        text: 'イベントの編集に失敗しました。',
      });
      setIsLoading(false);
      setIsSnackbarOpen(true);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onEditEvent)}
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
          name="event.title"
          label="イベントタイトル"
          startIcon={<AccessTimeIcon />}
        />
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <DatePickerRHF<EventSchemaType>
            name="event.startDateTime"
            control={control}
            label="開催日時"
          />
          <Box> ~ </Box>
          <DatePickerRHF<EventSchemaType>
            name="event.endDateTime"
            control={control}
            label="終了日時"
          />
        </Box>
        <TextFieldRHF<EventSchemaType>
          control={control}
          name="event.place"
          label="開催場所"
        />
        <TextFieldRHF<EventSchemaType>
          control={control}
          name="event.url"
          label="イベントページURL"
          // リンクつける
        />
        <TextFieldRHF<EventSchemaType>
          control={control}
          name="event.member"
          label="同行メンバー"
        />
        <TextFieldRHF<EventSchemaType>
          control={control}
          name="event.memo"
          label="詳細memo"
        />
        <TextFieldRHF<EventSchemaType>
          control={control}
          name="event.diary"
          label="イベントレポート"
        />
        <Box sx={{ width: '100%' }}>
          <Box sx={{ fontSize: 'small', padding: '6px' }}>イベントフォト</Box>

          {[...Array(1)].map((_, i) => {
            //mapでコンポーネントを返すとき、keyを必ず指定する
            return (
              <EventPhoto
                key={i}
                setValue={setValue}
                index={i}
                eventPhoto={eventPhotos[0]}
              />
            );
          })}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <FormLabel id="success">脱出 </FormLabel>
          <Controller
            control={control}
            name="event.success"
            render={({ field }) => (
              <RadioGroup
                ref={field.ref}
                row
                aria-labelledby="radio-buttons-group-label"
                name={field.name}
                onChange={field.onChange}
                value={field.value}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio disabled={field.disabled} />}
                  label="成功!!"
                  sx={{ color: '#0066CC' }}
                />
                <FormControlLabel
                  value="false"
                  control={<Radio disabled={field.disabled} />}
                  label="失敗"
                  sx={{ color: '#FF9872' }}
                />
              </RadioGroup>
            )}
          />
        </Box>
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
            編集
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
