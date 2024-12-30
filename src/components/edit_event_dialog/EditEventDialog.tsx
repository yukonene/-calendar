import { Dialog } from '@mui/material';
import { EditEventDialogContent } from './EditEventDialogContent';
import { EventT } from '@/types/EventT';
import { useSnackbarContext } from '../common/SnackbarProvider';

type Props = {
  event: EventT;
  isOpen: boolean;
  onClose: () => void;
  getEvent: () => void;
};

export const EditEventDialog = ({
  event,
  isOpen,
  onClose,
  getEvent,
}: Props) => {
  const { setSnackbarMessage, setIsSnackbarOpen } = useSnackbarContext();

  return (
    <>
      {/* useSnackbarContextを使っている為不要
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
      </Snackbar> */}

      <Dialog open={isOpen} onClose={onClose}>
        <EditEventDialogContent
          event={event}
          onClose={onClose}
          getEvent={getEvent}
          setSnackbarMessage={setSnackbarMessage}
          setIsSnackbarOpen={setIsSnackbarOpen}
        />
      </Dialog>
    </>
  );
};
