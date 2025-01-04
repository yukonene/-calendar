import { GetEventResponseSuccessBody } from '@/pages/api/events/[id]';
import { Box, Button, CircularProgress, Link } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { EditEventDialog } from '../components/edit_event_dialog/EditEventDialog';
import { useEventsContext } from '../components/EventsProvider';
import { EventT } from '@/types/EventT';
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';
import { DeleteEventDialog } from '../components/delete_event_dialog/DeleteEventDialog';
import { EventPhotoT } from '@/types/EventPhotoT';
import { getEvent } from '@/apis/events/getEvent';

type Props = {
  eventId: number | undefined;
};

export const DesktopEvent = ({ eventId }: Props) => {
  const { getEventInfoList } = useEventsContext();

  const [eventInfo, setEventInfo] = useState<{
    event: EventT;
    eventPhotos: EventPhotoT[];
  }>();
  // const [eventPhotos, setEventPhotos] = useState<EventPhotoT[]>([]);

  const getEventInfo = useCallback(() => {
    if (!eventId) {
      return;
    } else {
      getEvent(eventId)
        .then((res) => {
          setEventInfo(res.data); //GetEventsResponseSuccessBody=res.data
        })

        .catch((e) => {
          console.log(e.message);
        });
    }
  }, [eventId]);

  useEffect(() => {
    getEventInfo();
  }, [eventId, getEventInfo]);

  const [editEventDialogOpen, setEditEventDialogOpen] = useState(false);
  const handleEditEventClick = useCallback(() => {
    setEditEventDialogOpen(true);
    setEventInfo(eventInfo);
  }, [setEventInfo, eventInfo]);

  const [isDeleteEventDialogOpen, setIsDeleteEventDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteEventDialogOpen(true);
  };

  const handleClose = () => {
    setIsDeleteEventDialogOpen(false);
  };

  //ローディング中のevent内が空の時にCircularProgressを表示する
  //これによって一番下のretrunが表示されなくなる為event=undifindを避けられる
  if (!eventInfo) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  //↓ここではeventはundifindの値をとらない
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: '1px double white',
        borderRadius: '20px',
        padding: '16px',
        boxShadow: '2',
      }}
    >
      {/* タイトル */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box component={'label'} sx={{ fontSize: 'small' }}>
          イベントタイトル
        </Box>
        <Box sx={{ wordBreak: 'break-word' }}>{eventInfo.event.title}</Box>
      </Box>

      {/* イベント日時 */}
      <Box sx={{ display: 'flex' }}>
        <Box>
          {format(new Date(eventInfo.event.startDateTime), ' MM月dd日HH時mm分')}
        </Box>
        <Box>
          {!!eventInfo.event.endDateTime &&
            format(new Date(eventInfo.event.endDateTime), '~ MM月dd日HH時mm分')}
        </Box>
      </Box>

      {/* 開催場所 */}
      {!!eventInfo.event.place && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box component={'label'} sx={{ fontSize: 'small' }}>
            開催場所
          </Box>
          <Box sx={{ wordBreak: 'break-word' }}>{eventInfo.event.place}</Box>
        </Box>
      )}

      {/* URL */}
      {!!eventInfo.event.url && (
        <Link
          component={'button'}
          type={'button'}
          onClick={() => {
            if (!!eventInfo.event.url) {
              window.open(eventInfo.event.url);
            }
          }}
        >
          イベント詳細ページ
        </Link>
      )}

      {/* メンバー */}
      {!!eventInfo.event.member && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box component={'label'} sx={{ fontSize: 'small' }}>
            同行メンバー
          </Box>
          <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {eventInfo.event.member}
          </Box>
        </Box>
      )}

      {/* memo */}
      {!!eventInfo.event.memo && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box component={'label'} sx={{ fontSize: 'small' }}>
            詳細
          </Box>
          {/* whiteSpace: 'pre-wrap'→ユーザーが入力したテキストをそのまま見せたいとき */}
          <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {eventInfo.event.memo}
          </Box>
        </Box>
      )}

      {/* 日記 */}
      {!!eventInfo.event.diary && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box component={'label'} sx={{ fontSize: 'small' }}>
            イベントレポート
          </Box>
          <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {eventInfo.event.diary}
          </Box>
        </Box>
      )}

      {/* イベントフォト */}
      {eventInfo.eventPhotos.length > 0 && (
        <img
          src={eventInfo.eventPhotos[0].url}
          alt="eventPhoto"
          style={{ objectFit: 'contain', width: '100%', height: '250px' }}
        />
      )}

      {/* 成功・失敗 */}
      {eventInfo.event.success != null && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4px',
            color: eventInfo.event.success ? '#0066CC' : '#FF9872',
          }}
        >
          <Box component={'label'}>
            {eventInfo.event.success != null && '脱出'}
          </Box>
          <Box>
            {/* null undefined以外 */}
            {eventInfo.event.success ? '成功!!' : '失敗'}
          </Box>
        </Box>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Link
          component={'button'}
          type={'button'}
          onClick={handleClickOpen}
          variant={'body2'}
          sx={{ marginRight: 'auto' }}
        >
          削除
        </Link>

        <DeleteEventDialog
          eventInfo={eventInfo}
          isOpen={isDeleteEventDialogOpen}
          onClose={handleClose}
          afterDeleteEvent={getEventInfoList}
        />
        <Button
          variant="contained"
          size="small"
          sx={{
            width: '100px',
            marginTop: '16px',
            marginLeft: 'auto',
          }}
          onClick={handleEditEventClick}
          startIcon={<ModeEditTwoToneIcon />}
        >
          編集
        </Button>
        <EditEventDialog
          eventInfo={eventInfo}
          isOpen={editEventDialogOpen}
          onClose={() => setEditEventDialogOpen(false)}
          afterSaveEvent={getEventInfo}
        />
      </Box>
    </Box>
  );
};
