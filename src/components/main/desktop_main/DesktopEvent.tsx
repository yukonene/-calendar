import { GetEventResponseSuccessBody } from '@/pages/api/events/[id]';
import { Box, Button, CircularProgress, Link } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EditEventDialog } from '../common/edit_event_dialog/EditEventDialog';
import { useEventsContext } from '../common/EventsProvider';
import { EventT } from '@/types/EventT';
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';
import { DeleteEventDialog } from '../common/delete_event_dialog/DeleteEventDialog';

type Props = {
  eventId: number | undefined;
};

export const DesktopEvent = ({ eventId }: Props) => {
  const { getEvents } = useEventsContext();

  const [event, setEvent] = useState<EventT>();

  const getEvent = useCallback(() => {
    if (!eventId) {
      return;
    } else {
      axios
        .get<GetEventResponseSuccessBody>(`/api/events/${eventId}`)
        .then((res) => {
          setEvent(res.data.event); //GetEventsResponseSuccessBody=res.data
        })

        .catch((e) => {
          console.log(e.message);
        });
    }
  }, [eventId]);

  useEffect(() => {
    getEvent();
  }, [eventId, getEvent]);

  const [editEventDialogOpen, setEditEventDialogOpen] = useState(false);
  const handleEditEventClick = useCallback(() => {
    setEditEventDialogOpen(true);
    setEvent(event);
  }, [setEvent, event]);

  const [isDeleteEventDialogOpen, setIsDeleteEventDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteEventDialogOpen(true);
  };

  const handleClose = () => {
    setIsDeleteEventDialogOpen(false);
  };

  //ローディング中のevent内が空の時にCircularProgressを表示する
  //これによって一番下のretrunが表示されなくなる為event=undifindを避けられる
  if (!event) {
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
        height: '100%',
      }}
    >
      {/* タイトル */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box component={'label'} sx={{ fontSize: 'small' }}>
          イベントタイトル
        </Box>
        <Box>{event.title}</Box>
      </Box>

      {/* イベント日時 */}
      <Box sx={{ display: 'flex' }}>
        <Box>{format(new Date(event.startDateTime), ' MM月dd日HH時mm分')}</Box>
        <Box>
          {!!event.endDateTime &&
            format(new Date(event.endDateTime), '~ MM月dd日HH時mm分')}
        </Box>
      </Box>

      {/* 開催場所 */}
      {!!event.place && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box component={'label'} sx={{ fontSize: 'small' }}>
            開催場所
          </Box>
          <Box>{event.place}</Box>
        </Box>
      )}

      {/* URL */}
      {!!event.url && (
        <Link
          component={'button'}
          onClick={() => {
            if (!!event.url) {
              window.open(event.url);
            }
          }}
        >
          イベント詳細ページ
        </Link>
      )}

      {/* メンバー */}
      {!!event.member && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box component={'label'} sx={{ fontSize: 'small' }}>
            同行メンバー
          </Box>
          <Box>{event.member}</Box>
        </Box>
      )}

      {/* memo */}
      {!!event.memo && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box component={'label'} sx={{ fontSize: 'small' }}>
            詳細
          </Box>
          <Box>{event.memo}</Box>
        </Box>
      )}

      {/* 日記 */}
      {!!event.diary && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box component={'label'} sx={{ fontSize: 'small' }}>
            イベントレポート
          </Box>
          <Box>{event.diary}</Box>
        </Box>
      )}

      {/* 成功・失敗 */}
      {event.success != null && (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
          <Box component={'label'}>{event.success != null && '脱出'}</Box>
          <Box>
            {/* null undefined以外 */}
            {event.success ? '成功!!' : '失敗'}
          </Box>
        </Box>
      )}

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
        event={event}
        isOpen={editEventDialogOpen}
        onClose={() => setEditEventDialogOpen(false)}
        afterSaveEvent={getEvent}
      />
      <Box sx={{ display: 'flex' }}>
        <Link
          component={'button'}
          onClick={handleClickOpen}
          variant={'body2'}
          sx={{ marginLeft: 'auto' }}
        >
          削除
        </Link>
      </Box>

      <DeleteEventDialog
        event={event}
        isOpen={isDeleteEventDialogOpen}
        onClose={handleClose}
        afterDeleteEvent={getEvents}
      />
    </Box>
  );
};
