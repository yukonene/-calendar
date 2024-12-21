import { useCallback, useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import allLocales from '@fullcalendar/core/locales-all';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

import { Box } from '@mui/material';
import axios from 'axios';
import { NewEventModal } from './new_event_modal/NewEventModal';
import { GetEventsResponseSuccessBody } from '@/pages/api/events';

export const NeneCalendar = () => {
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [date, setDate] = useState<Date>(); //モーダルに日付データを渡す

  //モーダルopen時
  const handleDateClick = useCallback((info: DateClickArg) => {
    console.log(info);
    setIsNewEventModalOpen(true);
    setDate(info.date);
  }, []);
  //モーダルclose時
  const handleCloseModal = useCallback(() => {
    setIsNewEventModalOpen(false);
    setDate(undefined);
  }, []);

  const [events, setEvents] = useState<
    {
      id: number;
      title: string;
      startDateTime: string;
      endDateTime: string | null;
    }[]
  >([]);

  const eventList = useMemo(() => {
    return events.map((event) => {
      return {
        id: event.id.toString(), //typeを文字列に変換
        title: event.title,
        start: new Date(event.startDateTime),
        end: !!event.endDateTime ? new Date(event.endDateTime) : undefined,
      };
    });
  }, [events]);

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
    getEvents();
  }, []);
  return (
    <Box sx={{ minWidth: '50vw' }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locales={allLocales}
        locale="ja" // 日本語設定
        editable={true} // 編集可
        contentHeight={500}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: false,
        }}
        events={eventList}
        dateClick={handleDateClick}
      />

      <NewEventModal //イベント登録モーダル
        isOpen={isNewEventModalOpen}
        onClose={handleCloseModal}
        date={date}
        getEvents={getEvents}
      />
    </Box>
  );
};
