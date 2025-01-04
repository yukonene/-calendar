import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useFirebaseUserContext } from '../../../providers/FirebaseUserProvider';
import { EventT } from '@/types/EventT';
import { addMonths, endOfMonth, startOfMonth } from 'date-fns';
import { EventPhotoT } from '@/types/EventPhotoT';
import FullCalendar from '@fullcalendar/react';
import { getEvents } from '@/apis/events/getEvents';

const EventsContext = createContext(
  {} as {
    eventInfoList: {
      event: EventT;
      eventPhotos: EventPhotoT[];
    }[];
    setEventInfoList: Dispatch<
      SetStateAction<
        {
          event: EventT;
          eventPhotos: EventPhotoT[];
        }[]
      >
    >;
    getEventInfoList: () => void;
    setStartOfMouthDate: Dispatch<SetStateAction<Date>>;
    startOfMonthDate: Date;
    handlePrevButton: () => void;
    handleNextButton: () => void;
    calendarRef: RefObject<FullCalendar>;
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
  const calendarRef = useRef<FullCalendar>(null);
  const [eventInfoList, setEventInfoList] = useState<
    {
      event: EventT;
      eventPhotos: EventPhotoT[];
    }[]
  >([]);
  //月の前へ進む次へ進むボタンの基準になる日付
  const [startOfMonthDate, setStartOfMouthDate] = useState(
    startOfMonth(new Date())
  );

  const getEventInfoList = useCallback(
    //基本的にはusecallbackつける
    () => {
      // startOfMonthDateのある月の末尾を最後とする
      const endDateTime = endOfMonth(startOfMonthDate);
      getEvents({
        startDateTime: startOfMonthDate,
        endDateTime: endDateTime,
      })
        .then((res) => {
          setEventInfoList(res.data.eventInfoList); //GetEventsResponseSuccessBody=res.data
        })
        .catch((e) => {
          console.log(e.message);
        });
    },
    [startOfMonthDate]
  );

  useEffect(() => {
    //初回レンダリング時にイベントデータを取って来る
    if (!!firebaseUser) {
      getEventInfoList();
    }
  }, [getEventInfoList, startOfMonthDate, firebaseUser]);

  const handlePrevButton = useCallback(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      const prevStartOfMonthDate = addMonths(startOfMonthDate, -1);
      setStartOfMouthDate(prevStartOfMonthDate);
    }
  }, [startOfMonthDate, setStartOfMouthDate]);

  const handleNextButton = useCallback(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      const prevStartOfMonthDate = addMonths(startOfMonthDate, 1);
      setStartOfMouthDate(prevStartOfMonthDate);
    }
  }, [startOfMonthDate, setStartOfMouthDate]);

  return (
    <EventsContext.Provider
      value={{
        eventInfoList,
        setEventInfoList,
        getEventInfoList,
        setStartOfMouthDate,
        startOfMonthDate,
        handlePrevButton,
        handleNextButton,
        calendarRef,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
//mainで設定
