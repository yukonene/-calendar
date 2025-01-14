import { Dialog } from '@mui/material';
import { EditEventDialogContent } from './EditEventDialogContent';
import { EventT } from '@/types/EventT';
import { EventPhotoT } from '@/types/EventPhotoT';

type Props = {
  eventInfo: {
    event: EventT;
    eventPhotos: EventPhotoT[];
  };
  isOpen: boolean;
  onClose: () => void;
  afterSaveEvent: () => void;
};

export const EditEventDialog = ({
  eventInfo,
  isOpen,
  onClose,
  afterSaveEvent,
}: Props) => {
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

      <Dialog
        open={isOpen}
        onClose={onClose}
        scroll="body"
        fullWidth
        maxWidth={'sm'}
      >
        <EditEventDialogContent
          eventInfo={eventInfo}
          onClose={onClose}
          afterSaveEvent={afterSaveEvent}
        />
      </Dialog>
    </>
  );
};
