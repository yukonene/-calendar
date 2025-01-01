import { UserT } from '@/types/UserT';
import { Dialog } from '@mui/material';
import { useSnackbarContext } from '../../common/SnackbarProvider';
import { EditUserDialogContent } from './EditUserDialogContent';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: UserT;
  getProfile: () => void;
};

export const EditUserDialog = ({
  user,
  isOpen,
  onClose,
  getProfile,
}: Props) => {
  const { setSnackbarMessage, setIsSnackbarOpen } = useSnackbarContext();

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      scroll="body"
      fullWidth
      maxWidth={'md'}
    >
      <EditUserDialogContent
        user={user}
        onClose={onClose}
        getProfile={getProfile}
        setSnackbarMessage={setSnackbarMessage}
        setIsSnackbarOpen={setIsSnackbarOpen}
      />
    </Dialog>
  );
};
