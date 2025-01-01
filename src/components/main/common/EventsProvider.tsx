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
import { useFirebaseUserContext } from '../../common/FirebaseUserProvider';
import { EventT } from '@/types/EventT';

const EventsContext = createContext(
  {} as {
    events: EventT[];
    setEvents: Dispatch<SetStateAction<EventT[]>>;
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
  const [events, setEvents] = useState<EventT[]>([]);

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
  }, [getEvents, firebaseUser]);

  return (
    <EventsContext.Provider value={{ events, setEvents, getEvents }}>
      {children}
    </EventsContext.Provider>
  );
};
//mainで設定
