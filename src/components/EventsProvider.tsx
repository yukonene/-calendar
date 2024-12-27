import { GetEventsResponseSuccessBody } from '@/pages/api/events';
import axios from 'axios';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useFirebaseUserContext } from './common/FirebaseUserProvider';

const EventsContext = createContext(
  {} as {
    events: {
      id: number;
      title: string;
      startDateTime: string;
      endDateTime: string | null;
    }[];
    setEvents: Dispatch<
      SetStateAction<
        {
          id: number;
          title: string;
          startDateTime: string;
          endDateTime: string | null;
        }[]
      >
    >;
    getEvents: () => void;
  }
);

//EventsContextProviderが巻かれているコンポーネント内でのみ使える
export const useEventsContext = () => {
  return useContext(EventsContext);
};
type Props = {
  children: ReactNode;
};

export const EventsProvider = ({ children }: Props) => {
  const { firebaseUser } = useFirebaseUserContext();
  const [events, setEvents] = useState<
    {
      id: number;
      title: string;
      startDateTime: string;
      endDateTime: string | null;
    }[]
  >([]);

  const getEvents = useCallback(() => {
    //基本的にはusecallbackつける
    axios
      .get<GetEventsResponseSuccessBody>('/api/events/')
      .then((res) => {
        setEvents(res.data.events); //GetEventsResponseSuccessBody=res.data
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  useEffect(() => {
    //初回レンダリング時にイベントデータを取って来る
    if (!!firebaseUser) {
      getEvents();
    }
  }, [getEvents]);

  return (
    <EventsContext.Provider value={{ events, setEvents, getEvents }}>
      {children}
    </EventsContext.Provider>
  );
};
//mainで設定
