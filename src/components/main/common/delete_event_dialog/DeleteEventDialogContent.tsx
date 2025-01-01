import { EventT } from '@/types/EventT';
import { useSnackbarContext } from '@/components/common/SnackbarProvider';
import { Box, DialogTitle, DialogActions, Button } from '@mui/material';
import { useCallback } from 'react';
import { DeleteEventResponseSuccessBody } from '@/pages/api/events/[id]';
import axios from 'axios';

type Props = {
  onClose: () => void;
  event: EventT;
  afterDeleteEvent: () => void;
};

export const DeleteEventDialogContent = ({
  onClose,
  event,
  afterDeleteEvent,
}: Props) => {
  const { setSnackbarMessage, setIsSnackbarOpen } = useSnackbarContext();

  const deleteEvent = useCallback(() => {
    axios
      .delete<DeleteEventResponseSuccessBody>(`/api/events/${event.id}`) //deleteする
      .then(() => {
        setSnackbarMessage({
          severity: 'success',
          text: 'イベント削除完了',
        });
        afterDeleteEvent();
        setIsSnackbarOpen(true);
        onClose();
      })
      .catch((error) => {
        setSnackbarMessage({
          severity: 'error',
          text: 'イベントの削除に失敗しました。',
        });
        setIsSnackbarOpen(true);
      });
  }, [
    afterDeleteEvent,
    event.id,
    onClose,
    setIsSnackbarOpen,
    setSnackbarMessage,
  ]);

  return (
    <Box>
      <DialogTitle id="alert-dialog-title">
        {'削除してもよろしいですか？'}
      </DialogTitle>

      <DialogActions>
        <Button onClick={onClose}>いいえ</Button>
        <Button onClick={deleteEvent} autoFocus>
          はい
        </Button>
      </DialogActions>
    </Box>
  );
};
