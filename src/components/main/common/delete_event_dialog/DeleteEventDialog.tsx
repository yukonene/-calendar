import { Dialog } from '@mui/material';
import { EventT } from '@/types/EventT';
import { DeleteEventDialogContent } from './DeleteEventDialogContent';

type Props = {
  event: EventT;
  isOpen: boolean;
  onClose: () => void;
  afterDeleteEvent: () => void;
};

export const DeleteEventDialog = ({
  event,
  isOpen,
  onClose,
  afterDeleteEvent,
}: Props) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      scroll="body"
      fullWidth
      maxWidth={'sm'}
    >
      <DeleteEventDialogContent
        event={event}
        onClose={onClose}
        afterDeleteEvent={afterDeleteEvent}
      />
    </Dialog>
  );
};
