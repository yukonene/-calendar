import * as React from 'react';
import Box from '@mui/material/Box';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { TextFieldRHF } from '../../../components/forms/TextFieldRHF';
import { Avatar, Button, Link } from '@mui/material';
import {
  PatchUserRequestBody,
  PatchUserResponseSuccessBody,
} from '@/pages/api/user';
import { LoadingButton } from '@mui/lab';
import {
  PostGenerateSignedUrlsRequestBody,
  PostGenerateSignedUrlsResposeSuccessBody,
} from '@/pages/api/generateSignedUrls';
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react';
import { UserT } from '@/types/UserT';
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from '@/constants/imageSetting';
import src from '@emotion/styled';
import { postGenerateSignedUrls } from '@/apis/postGenerateSignedUrls';
import { patchUser } from '@/apis/patchUser';

const userProfileScheme = z.object({
  name: z.string(),
  avatar: z
    .instanceof(File)
    .nullable()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'ファイルサイズを30MB以内にしてください')
    .refine((file) => {
      return !file || ACCEPTED_FILE_TYPES.includes(file.type);
    }, '画像ファイルのみアップロードできます'),
  activityAreas: z.string().max(255, { message: '文字数超過' }).nullable(),
  favoriteType: z.string().max(255, { message: '文字数超過' }).nullable(), //nullかも
  strongPoints: z.string().max(255, { message: '文字数超過' }).nullable(),
  favoriteGroup: z.string().max(255, { message: '文字数超過' }).nullable(),
});
type UserProfileSchemaType = z.infer<typeof userProfileScheme>;

type Props = {
  onClose: () => void;
  user: UserT;
  getProfile: () => void;
  setIsSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  setSnackbarMessage: Dispatch<
    SetStateAction<{
      severity: 'success' | 'error';
      text: string;
    }>
  >;
};

export const EditUserDialogContent = ({
  onClose,
  user,
  getProfile,
  setSnackbarMessage,
  setIsSnackbarOpen,
}: Props) => {
  const {
    //何を使うか
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserProfileSchemaType>({
    //<型>(中身：オブジェクトの形)
    resolver: zodResolver(userProfileScheme),
    mode: 'onSubmit',
    criteriaMode: 'all',
    defaultValues: {
      //初期設定のやつとってくる
      name: user.name,
      avatar: null, //ファイルの初期値はnullにすること
      activityAreas: user.activityAreas,
      favoriteType: user.favoriteType,
      strongPoints: user.strongPoints,
      favoriteGroup: user.favoriteGroup,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    user.avatarUrl ?? undefined
  );
  //↑nullはエラーになる為、nullの場合はundefindに変換
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const onChangeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      //↓setValue（どこに、何を）セットするか
      setValue('avatar', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target !== null) {
          setAvatarUrl(e.target.result as string); // 読み込み完了時にData URIをsrcに渡す URIはURLと同じようなもの
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const avatarDelete = () => {
    setAvatarUrl(undefined); //ブラウザ上で画像を表示する為のURLを削除
    setValue('avatar', null); //reactHookForm内のavatarのファイルを削除する
    if (!!avatarInputRef.current) {
      //input内に残ったvalueの値を削除する
      avatarInputRef.current.value = '';
    }
  };

  //保存ボタンを押したとき
  const onClickSave = async (data: UserProfileSchemaType) => {
    setIsLoading(true);
    try {
      let fileKey = null;
      let filename = null;
      if (!!data.avatar) {
        //signedURLの取得
        const postData = {
          uploadLength: 1,
        };
        const res = await postGenerateSignedUrls(postData);
        fileKey = res.data.uploads[0].fileKey;
        //fileにnameをつけるとファイルの名前がとれる決まり
        filename = data.avatar.name;

        //取得したURLを使ってＧＣＳにファイルをPUTする
        await axios.put(res.data.uploads[0].signedGcsUrl, data.avatar, {
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        });
      }

      //全てのデータの更新
      const patchData = {
        name: data.name,
        avatarFileKey: fileKey,
        avatarOriginalFileName: filename,
        activityAreas: data.activityAreas,
        favoriteType: data.favoriteType,
        strongPoints: data.strongPoints,
        favoriteGroup: data.favoriteGroup,
      };

      await patchUser(patchData); //patchする

      setSnackbarMessage({
        severity: 'success',
        text: 'プロフィール編集完了',
      });
      setIsLoading(false);
      getProfile(); //Profileで作る
      setIsSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.log('error', error);
      setSnackbarMessage({
        severity: 'error',
        text: 'プロフィールの編集に失敗しました。',
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
        gap: '16px',
        border: '1px double white',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '3',
        alignItems: 'center',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onClickSave)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          width: '100%',
        }}
      >
        <TextFieldRHF<UserProfileSchemaType>
          control={control}
          name="name"
          label="名前"
        />

        <Box sx={{ width: '100%' }}>
          <Box sx={{ fontSize: 'small', padding: '6px' }}>プロフィール画像</Box>
          {!!avatarUrl && (
            <Avatar
              alt="avatar"
              src={avatarUrl}
              sx={{ width: '70px', height: '70px', marginBottom: '8px' }}
            />
          )}
          <input
            name="avatar"
            type="file"
            accept="image/*"
            onChange={onChangeAvatar}
            ref={avatarInputRef}
          />

          {!!avatarUrl && (
            <Button
              onClick={avatarDelete}
              variant={'text'}
              sx={{
                // marginTop: '16px',
                fontSize: 'small',
              }}
            >
              画像削除
            </Button>
          )}
        </Box>
        <TextFieldRHF<UserProfileSchemaType>
          control={control}
          name="activityAreas"
          label="イベント参加地域"
          multiline={true}
          autoComplete="off"
        />
        <TextFieldRHF<UserProfileSchemaType>
          control={control}
          name="favoriteType"
          label="好きなイベントのタイプ"
          multiline={true}
        />

        <TextFieldRHF<UserProfileSchemaType>
          control={control}
          name="strongPoints"
          label="得意な謎、配役等"
          multiline={true}
        />
        <TextFieldRHF<UserProfileSchemaType>
          control={control}
          name="favoriteGroup"
          label="よく行く、推しの団体"
          multiline={true}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          {/* ↓送信中にloading表示されるボタン */}
          <LoadingButton
            type={'submit'}
            variant={'contained'}
            sx={{
              width: '150px',
              marginTop: '16px',
              margin: '8px',
            }}
            loading={isLoading}
            startIcon={<ModeEditTwoToneIcon />}
          >
            保存
          </LoadingButton>

          <Link
            component={'button'}
            type={'button'}
            onClick={onClose}
            variant={'body2'}
          >
            キャンセル
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
