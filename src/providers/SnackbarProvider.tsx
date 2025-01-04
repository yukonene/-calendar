import { Alert, Snackbar } from '@mui/material';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

const SnackbarContext = createContext(
  {} as {
    setSnackbarMessage: Dispatch<
      SetStateAction<{
        severity: 'success' | 'error';
        text: string;
      }>
    >;
    setIsSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  }
);

//EventsContextProviderが巻かれているコンポーネント内でのみ使える
export const useSnackbarContext = () => {
  return useContext(SnackbarContext);
};
type Props = {
  children: ReactNode;
};

export const SnackbarProvider = ({ children }: Props) => {
  const [snackbarMessage, setSnackbarMessage] = useState<{
    severity: 'success' | 'error';
    text: string;
  }>({ severity: 'error', text: '' });
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  return (
    <SnackbarContext.Provider value={{ setSnackbarMessage, setIsSnackbarOpen }}>
      {/*↓↓ 中身は一つにまとめる */}
      <>
        {children}
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
      </>
    </SnackbarContext.Provider>
  );
};
//どこでも使いたいので_appで設定
