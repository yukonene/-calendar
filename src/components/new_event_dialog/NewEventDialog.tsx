import * as React from 'react';
import { NewEventDialogContent } from './NewEventDialogContent';
import { useSnackbarContext } from '../common/SnackbarProvider';
import { Dialog } from '@mui/material';

type Props = {
  //props受け取る準備
  isOpen: boolean;
  onClose: () => void;
  date: Date | undefined;
};

export const NewEventDialog = ({ isOpen, onClose, date }: Props) => {
  const { setSnackbarMessage, setIsSnackbarOpen } = useSnackbarContext();
  return (
    <>
      {/* dateの値がある場合 */}
      {!!date && (
        <Dialog open={isOpen} onClose={onClose}>
          <NewEventDialogContent
            onClose={onClose}
            date={date}
            setSnackbarMessage={setSnackbarMessage}
            setIsSnackbarOpen={setIsSnackbarOpen}
          />
        </Dialog>
      )}
    </>
  );
};
