import { Alert, Modal, Snackbar } from '@mui/material';
import { useState } from 'react';
import { EditEventModalContent } from './EditEventModalContent';
import { EventT } from '@/types/EventT';

type Props = {
  event: EventT;
  isOpen: boolean;
  onClose: () => void;
  getEvent: () => void;
};

export const EditEventModal = ({ event, isOpen, onClose, getEvent }: Props) => {
  const [snackbarMessage, setSnackbarMessage] = useState<{
    severity: 'success' | 'error';
    text: string;
  }>({ severity: 'error', text: '' });
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  return (
    <>
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

      <Modal open={isOpen} onClose={onClose}>
        <EditEventModalContent
          event={event}
          onClose={onClose}
          getEvent={getEvent}
          setSnackbarMessage={setSnackbarMessage}
          setIsSnackbarOpen={setIsSnackbarOpen}
        />
      </Modal>
    </>
  );
};
