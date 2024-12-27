import { User } from 'firebase/auth';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

const FirebaseUserContext = createContext(
  {} as {
    firebaseUser: User | null;
    setFirebaseUser: Dispatch<SetStateAction<User | null>>;
  }
);

//FirebaseUserProviderが巻かれているコンポーネント内でのみ使える
export const useFirebaseUserContext = () => {
  return useContext(FirebaseUserContext);
};
type Props = {
  children: ReactNode;
};

export const FirebaseUserProvider = ({ children }: Props) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  return (
    <FirebaseUserContext.Provider value={{ firebaseUser, setFirebaseUser }}>
      {children}
    </FirebaseUserContext.Provider>
  );
};
//後、_appで定義して全てのコンポーネントで使えるようにする
