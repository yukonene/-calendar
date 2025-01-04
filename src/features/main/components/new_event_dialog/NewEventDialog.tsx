import * as React from 'react';
import { NewEventDialogContent } from './NewEventDialogContent';
import { Dialog } from '@mui/material';

type Props = {
  //props受け取る準備
  isOpen: boolean;
  onClose: () => void;
  date: Date | undefined;
  afterSaveEvent: () => void;
};

export const NewEventDialog = ({
  isOpen,
  onClose,
  date,
  afterSaveEvent,
}: Props) => {
  return (
    <>
      {/* dateの値がある場合 */}
      {!!date && (
        <Dialog open={isOpen} onClose={onClose}>
          <NewEventDialogContent
            onClose={onClose}
            date={date}
            afterSaveEvent={afterSaveEvent}
          />
        </Dialog>
      )}
    </>
  );
};
