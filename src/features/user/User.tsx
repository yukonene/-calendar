import { useCallback, useEffect, useState } from 'react';
import { EditUserDialog } from './edit_user_dialog/EditUserDialog';
import { Avatar, Box, Button, CircularProgress } from '@mui/material';
import { useFirebaseUserContext } from '../../providers/FirebaseUserProvider';
import { UserT } from '@/types/UserT';
import { auth } from '@/lib/firebase/firebaseClient';
import router from 'next/router';
import { getUser } from '@/apis/users/getUser';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarsIcon from '@mui/icons-material/Stars';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlaceIcon from '@mui/icons-material/Place';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import MilitaryTechSharpIcon from '@mui/icons-material/MilitaryTechSharp';

export const User = () => {
  const [editUserDialogOpen, SetEditUserDialogOpen] = useState(false);
  useCallback(() => {
    SetEditUserDialogOpen(true);
  }, []);
  const handleEditUserClick = useCallback(() => {
    SetEditUserDialogOpen(true);
  }, []);

  const { firebaseUser, setFirebaseUser } = useFirebaseUserContext();
  const [user, setUser] = useState<UserT>();
  const getProfile = useCallback(() => {
    //基本的にはusecallbackつける
    getUser()
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
  }, [getProfile, firebaseUser]);

  //ローディング中のuser内が空の時にCircularProgressを表示する
  //これによって一番下のretrunが表示されなくなる為user=undifindを避けられる
  if (!user) {
    return (
      <Box sx={{ display: 'flex', height: '100%' }}>
        <CircularProgress sx={{ margin: 'auto' }} />
      </Box>
    );
  }
  const logout = () => {
    auth.signOut();
    setFirebaseUser(null);
    router.push('/login');
  };

  //↓ここではuserはundifindの値をとらない
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        // overflowをつける前に親のheightを確認する。自分自身の高さが決まっている状態でのみ使える。
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
          maxWidth: '700px',
          backgroundColor: 'white',
          margin: 'auto',
          marginTop: '8px',
        }}
      >
        {/* //////コンテンツ////////////////////////////////////// */}
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
            }}
          >
            {/* 名前/////////// */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px double white',
                borderRadius: '20px',
                padding: '16px',
                boxShadow: '2',
                width: '250px',
              }}
            >
              <Box
                component={'label'}
                sx={{
                  fontSize: 'small',
                  color: '#7aabaa',
                }}
              >
                <SentimentSatisfiedAltIcon sx={{ fontSize: 'small' }} />
                名前
              </Box>
              <Box sx={{ wordBreak: 'break-word' }}>{user.name}</Box>
            </Box>

            {/* プロフィール画像 */}
            {!!user.avatarUrl && (
              <Avatar
                src={user.avatarUrl}
                alt="avatar"
                sx={{ width: '70px', height: '70px', marginBottom: '8px' }}
              />
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
            }}
          >
            {/* イベント参加地域//////// */}
            {!!user.activityAreas && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px double white',
                  borderRadius: '20px',
                  padding: '16px',
                  boxShadow: '2',
                  width: '200px',
                }}
              >
                <Box
                  component={'label'}
                  sx={{ fontSize: 'small', color: '#7aabaa' }}
                >
                  <PlaceIcon sx={{ fontSize: 'small' }} />
                  イベント参加地域
                </Box>
                <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {user.activityAreas}
                </Box>
              </Box>
            )}

            {/* 好きなイベントのタイプ/////////// */}
            {!!user.favoriteType && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px double white',
                  borderRadius: '20px',
                  padding: '16px',
                  boxShadow: '2',
                  width: '200px',
                }}
              >
                <Box
                  component={'label'}
                  sx={{ fontSize: 'small', color: '#7aabaa' }}
                >
                  <FavoriteBorderIcon sx={{ fontSize: 'small' }} />
                  好きなイベントのタイプ
                </Box>
                <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {user.favoriteType}
                </Box>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: '16px',
            }}
          >
            {/* 得意な謎、配役等////////////// */}
            {!!user.strongPoints && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px double white',
                  borderRadius: '20px',
                  padding: '16px',
                  boxShadow: '2',
                  width: '200px',
                }}
              >
                <Box
                  component={'label'}
                  sx={{ fontSize: 'small', color: '#7aabaa' }}
                >
                  <StarsIcon sx={{ fontSize: 'small' }} />
                  得意な謎、配役等
                </Box>
                <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {user.strongPoints}
                </Box>
              </Box>
            )}

            {/* よく行く、推しの団体//////// */}
            {!!user.favoriteGroup && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px double white',
                  borderRadius: '20px',
                  padding: '16px',
                  boxShadow: '2',
                  width: '200px',
                }}
              >
                <Box
                  component={'label'}
                  sx={{ fontSize: 'small', color: '#7aabaa' }}
                >
                  <FavoriteIcon sx={{ fontSize: 'small' }} />
                  よく行く、推しの団体
                </Box>
                <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {user.favoriteGroup}
                </Box>
              </Box>
            )}
          </Box>
          {/* 戦績 */}
          {!!user.winRate && (
            <Box sx={{ display: 'flex', margin: 'auto', color: '#ffa07a' }}>
              <MilitaryTechSharpIcon />
              <Box>脱出成功率{user.winRate}%</Box>
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
          sx={{
            width: '150px',
            marginTop: '16px',
            margin: '8px',
            backgroundColor: '#4169e1',
            blockSize: '30px',
          }}
          onClick={handleEditUserClick}
        >
          編集
        </Button>
        <Box sx={{ display: 'flex' }}>
          <Button
            onClick={logout}
            sx={{ marginLeft: 'auto', fontSize: 'small', color: '#b0c4de' }}
          >
            ログアウト
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
