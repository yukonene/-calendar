import { useCallback, useEffect, useState } from 'react';
import { EditUserDialog } from './edit_user_dialog/EditUserDialog';
import { Box, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { GetUserResponseSuccessBody } from '@/pages/api/user';
import { useFirebaseUserContext } from './common/FirebaseUserProvider';
import { UserT } from '@/types/UserT';

export const User = () => {
  const [editUserDialogOpen, SetEditUserDialogOpen] = useState(false);
  useCallback(() => {
    SetEditUserDialogOpen(true);
  }, []);
  const handleEditUserClick = useCallback(() => {
    SetEditUserDialogOpen(true);
  }, []);

  const { firebaseUser } = useFirebaseUserContext();
  const [user, setUser] = useState<UserT>();
  const getProfile = useCallback(() => {
    //基本的にはusecallbackつける
    axios
      .get<GetUserResponseSuccessBody>('/api/user/')
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  useEffect(() => {
    //初回レンダリング時にイベントデータを取って来る
    if (!!firebaseUser) {
      getProfile();
    }
  }, [getProfile]);

  //ローディング中のuser内が空の時にCircularProgressを表示する
  //これによって一番下のretrunが表示されなくなる為user=undifindを避けられる
  if (!user) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }
  //↓ここではuserはundifindの値をとらない
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
          border: '1px double white',
          borderRadius: '20px',
          padding: '16px',
          boxShadow: '2',
          width: '580px',
          margin: 'auto',
          marginTop: '8px',
        }}
      >
        {/* コンテンツ */}
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px double white',
              borderRadius: '20px',
              padding: '16px',
              boxShadow: '2',
              width: '260px',
            }}
          >
            <Box
              component={'label'}
              sx={{
                fontSize: 'small',
                color: '#7aabaa',
              }}
            >
              名前
            </Box>
            <Box>{user.name}</Box>
          </Box>

          {/* プロフィール画像 */}
          {!!user.avatarUrl && (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box>{user.avatarUrl}</Box>
            </Box>
          )}
          {!!user.activityAreas && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px double white',
                borderRadius: '20px',
                padding: '16px',
                boxShadow: '2',
                width: '260px',
              }}
            >
              <Box
                component={'label'}
                sx={{ fontSize: 'small', color: '#7aabaa' }}
              >
                イベント参加地域
              </Box>
              <Box>{user.activityAreas}</Box>
            </Box>
          )}

          {!!user.favoriteType && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px double white',
                borderRadius: '20px',
                padding: '16px',
                boxShadow: '2',
                width: '260px',
              }}
            >
              <Box
                component={'label'}
                sx={{ fontSize: 'small', color: '#7aabaa' }}
              >
                好きなイベントのタイプ
              </Box>
              <Box>{user.favoriteType}</Box>
            </Box>
          )}

          {!!user.strongPoints && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px double white',
                borderRadius: '20px',
                padding: '16px',
                boxShadow: '2',
                width: '260px',
              }}
            >
              <Box
                component={'label'}
                sx={{ fontSize: 'small', color: '#7aabaa' }}
              >
                得意な謎、配役等
              </Box>
              <Box>{user.strongPoints}</Box>
            </Box>
          )}

          {!!user.favoriteGroup && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px double white',
                borderRadius: '20px',
                padding: '16px',
                boxShadow: '2',
                width: '260px',
              }}
            >
              <Box
                component={'label'}
                sx={{ fontSize: 'small', color: '#7aabaa' }}
              >
                よく行く、推しの団体
              </Box>
              <Box>{user.favoriteGroup}</Box>
            </Box>
          )}

          {/* 戦績 */}
          {!!user.winRate && (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box component={'label'}>脱出成功率</Box>
              <Box>{user.winRate}</Box>
            </Box>
          )}
        </Box>

        <EditUserDialog
          onClose={() => SetEditUserDialogOpen(false)}
          isOpen={editUserDialogOpen}
          user={user}
          getProfile={getProfile}
        />
        <Button
          variant="contained"
          sx={{ width: '150px', marginTop: '16px', margin: '8px' }}
          onClick={handleEditUserClick}
        >
          編集
        </Button>
      </Box>
    </Box>
  );
};
