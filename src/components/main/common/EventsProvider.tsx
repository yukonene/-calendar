import { GetEventsResponseSuccessBody } from '@/pages/api/events';
import axios from 'axios';
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
import { useFirebaseUserContext } from '../../common/FirebaseUserProvider';
import { EventT } from '@/types/EventT';
import { addMonths, endOfMonth, startOfMonth } from 'date-fns';
import { EventPhotoT } from '@/types/EventPhotoT';
import FullCalendar from '@fullcalendar/react';

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
      // クエリを設定する為にURLSearchParamsを使う
      const params = new URLSearchParams();

      // startOfMonthDateのある月の1日をスタートとする
      params.set('startDateTime', startOfMonthDate.toISOString());
      // startOfMonthDateのある月の末尾を最後とする
      const endDateTime = endOfMonth(startOfMonthDate);
      params.set('endDateTime', endDateTime.toISOString());

      axios
        // params.toString()を行うと、もしparamsに何も設定されていない場合は""が返る
        // 設定されていた場合は、key=valueの形で返ってくる
        //  例： http://localhost:3000/api/events?startDateTime=2024-12-31T15%3A00%3A00.000Z&endDateTime=2025-01-31T14%3A59%3A59.999Z
        .get<GetEventsResponseSuccessBody>(`/api/events?${params.toString()}`)
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
