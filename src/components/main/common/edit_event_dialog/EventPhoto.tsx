import { Box, Button } from '@mui/material';
import { ChangeEvent, useRef, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { EventSchemaType } from './EditEventDialogContent';
import { EventPhotoT } from '@/types/EventPhotoT';

type Props = {
  setValue: UseFormSetValue<EventSchemaType>;
  index: number;
  eventPhoto: EventPhotoT;
};

export const EventPhoto = ({ setValue, index, eventPhoto }: Props) => {
  const [eventPhotoUrl, setEventPhotoUrl] = useState<string | undefined>(
    eventPhoto.url ?? undefined
  );
  const eventPhotoInputRef = useRef<HTMLInputElement>(null);

  const onChangeEventPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      //↓setValue（どこに、何を）セットするか
      setValue(`eventPhotos.${index}`, file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target !== null) {
          setEventPhotoUrl(e.target.result as string); // 読み込み完了時にData URIをsrcに渡す URIはURLと同じようなもの
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const eventPhotoDelete = () => {
    setEventPhotoUrl(undefined); //ブラウザ上で画像を表示する為のURLを削除
    setValue(`eventPhotos.${index}`, null); //reactHookForm内、`eventPhotos.${index}`のファイルを削除する
    if (!!eventPhotoInputRef.current) {
      //input内に残ったvalueの値を削除する
      eventPhotoInputRef.current.value = '';
    }
  };

  return (
    <Box>
      {!!eventPhotoUrl && (
        <img
          src={eventPhotoUrl}
          alt="eventPhotoUrl"
          style={{
            objectFit: 'contain',
            width: '100%',
            height: '250px',
          }}
        />
      )}
      <input
        name="eventPhoto"
        type="file"
        accept="image/*"
        onChange={onChangeEventPhoto}
        ref={eventPhotoInputRef}
      />

      {!!eventPhotoUrl && (
        <Button
          onClick={eventPhotoDelete}
          variant={'text'}
          sx={{
            fontSize: 'small',
          }}
        >
          画像削除
        </Button>
      )}
    </Box>
  );
};
