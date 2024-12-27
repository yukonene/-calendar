import {
  DeleteEventResponseSuccessBody,
  GetEventResponseSuccessBody,
} from '@/pages/api/events/[id]';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Snackbar,
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EditEventModal } from './edit_event_modal/EditEventModal';
import { useEventsContext } from './EventsProvider';
import { EventT } from '@/types/EventT';

type Props = {
  eventId: number | undefined;
};

export const Event = ({ eventId }: Props) => {
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

  const [editEventModalOpen, SetEditEventModalOpen] = useState(false);
  const handleEditEventClick = useCallback(() => {
    SetEditEventModalOpen(true);
    setEvent(event);
  }, [setEvent, event]);
  console.log(editEventModalOpen);

  const [snackbarMessage, setSnackbarMessage] = useState<{
    severity: 'success' | 'error';
    text: string;
  }>({ severity: 'error', text: '' });
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const deleteEvent = useCallback(() => {
    if (!eventId) return;

    axios
      .delete<DeleteEventResponseSuccessBody>(`/api/events/${eventId}`) //deleteする
      .then(() => {
        setSnackbarMessage({
          severity: 'success',
          text: 'イベント削除完了',
        });
        getEvents();
        setEvent(undefined);
        setIsSnackbarOpen(true);
        handleClose();
      })
      .catch((error) => {
        setSnackbarMessage({
          severity: 'error',
          text: 'イベントの削除に失敗しました。',
        });
        setIsSnackbarOpen(true);
      });
  }, [eventId, getEvents]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Box>
        {!!event ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
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
              <Box>
                {format(new Date(event.startDateTime), ' MM月dd日HH時mm分')}
              </Box>
              <Box>
                {!!event.endDateTime &&
                  format(new Date(event.endDateTime), '~ MM月dd日HH時mm分')}
              </Box>
            </Box>

            {/* 開催場所 */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box component={'label'} sx={{ fontSize: 'small' }}>
                {!!event.place && '開催場所'}
              </Box>
              <Box>{!!event.place && event.place}</Box>
            </Box>

            {/* URL */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box component={'label'} sx={{ fontSize: 'small' }}>
                {!!event.url && 'URL'}
              </Box>
              <Box>{!!event.url && event.url}</Box>
            </Box>

            {/* メンバー */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box component={'label'} sx={{ fontSize: 'small' }}>
                {!!event.member && '同行メンバー'}
              </Box>
              <Box>{!!event.member && event.member}</Box>
            </Box>

            {/* memo */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box component={'label'} sx={{ fontSize: 'small' }}>
                {!!event.memo && '詳細'}
              </Box>
              <Box>{!!event.memo && event.memo}</Box>
            </Box>

            {/* 日記 */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box component={'label'} sx={{ fontSize: 'small' }}>
                {!!event.diary && 'イベントレポート'}
              </Box>
              <Box>{!!event.diary && event.diary}</Box>
            </Box>

            {/* 成功・失敗 */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box component={'label'}>{event.success != null && '脱出'}</Box>
              <Box>
                {/* null undefined以外 */}
                {event.success != null && (event.success ? '成功' : '失敗')}
              </Box>
            </Box>

            <Button
              variant="contained"
              sx={{ width: '150px', marginTop: '16px', margin: '8px' }}
              onClick={handleEditEventClick}
            >
              編集
            </Button>
            <Box>
              <Button
                variant="contained"
                sx={{
                  width: '150px',
                  marginTop: '16px',
                  margin: '8px',
                  backgroundColor: 'gray',
                }}
                onClick={handleClickOpen}
              >
                削除
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {'削除してもよろしいですか？'}
                </DialogTitle>

                <DialogActions>
                  <Button onClick={handleClose}>いいえ</Button>
                  <Button onClick={deleteEvent} autoFocus>
                    はい
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
            <EditEventModal
              event={event}
              isOpen={editEventModalOpen}
              onClose={() => SetEditEventModalOpen(false)}
              getEvent={getEvent}
            />
          </Box>
        ) : null}
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setIsSnackbarOpen(false)}
          severity={snackbarMessage.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};
