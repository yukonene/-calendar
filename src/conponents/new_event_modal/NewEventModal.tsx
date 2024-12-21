import * as React from 'react';
import Modal from '@mui/material/Modal';
import { Alert, Snackbar } from '@mui/material';
import { NewEventModalContent } from './NewEventModalContent';
import { useState } from 'react';

type Props = {
  //props受け取る準備
  isOpen: boolean;
  onClose: () => void;
  date: Date | undefined;
  getEvents: () => void;
};

export const NewEventModal = ({ isOpen, onClose, date, getEvents }: Props) => {
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

      {/* dateの値がある場合 */}
      {!!date && (
        <Modal
          open={isOpen}
          onClose={onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <NewEventModalContent
            onClose={onClose}
            date={date}
            setSnackbarMessage={setSnackbarMessage}
            setIsSnackbarOpen={setIsSnackbarOpen}
            getEvents={getEvents}
          />
        </Modal>
      )}
    </>
  );
};
