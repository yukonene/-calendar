import {
  DeleteEventResponseSuccessBody,
  GetEventResponseSuccessBody,
} from '@/pages/api/events/[id]';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Link,
  Snackbar,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EditEventDialog } from './edit_event_dialog/EditEventDialog';
import { useEventsContext } from './EventsProvider';
import { EventT } from '@/types/EventT';
import { useSnackbarContext } from './common/SnackbarProvider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';

type Props = {
  eventId: number | undefined;
};

export const Event = ({ eventId }: Props) => {
  const { getEvents } = useEventsContext();
  const { setSnackbarMessage, setIsSnackbarOpen } = useSnackbarContext();

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

      <Accordion elevation={0} sx={{ width: '100%' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">イベントレポート</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* 日記 */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box component={'label'} sx={{ fontSize: 'small' }}>
              {!!event.diary && 'イベントレポート'}
            </Box>
            <Box>{!!event.diary && event.diary}</Box>
          </Box>

          {/* 成功・失敗 */}
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
            <Box component={'label'}>{event.success != null && '脱出'}</Box>
            <Box>
              {/* null undefined以外 */}
              {event.success != null && (event.success ? '成功!!' : '失敗')}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

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
      <Box sx={{ display: 'flex' }}>
        <Link
          component={'button'}
          onClick={handleClickOpen}
          variant={'body2'}
          sx={{ marginLeft: 'auto' }}
        >
          削除
        </Link>
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
      <EditEventDialog
        event={event}
        isOpen={editEventDialogOpen}
        onClose={() => setEditEventDialogOpen(false)}
        getEvent={getEvent}
      />
    </Box>
  );
};
