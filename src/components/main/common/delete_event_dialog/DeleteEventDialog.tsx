import { Dialog } from '@mui/material';
import { EventT } from '@/types/EventT';
import { DeleteEventDialogContent } from './DeleteEventDialogContent';
import { EventPhotoT } from '@/types/EventPhotoT';

type Props = {
  eventInfo: {
    event: EventT;
    eventPhotos: EventPhotoT[];
  };
  isOpen: boolean;
  onClose: () => void;
  afterDeleteEvent: () => void;
};

export const DeleteEventDialog = ({
  eventInfo,
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
        eventInfo={eventInfo}
        onClose={onClose}
        afterDeleteEvent={afterDeleteEvent}
      />
    </Dialog>
  );
};
