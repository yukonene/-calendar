import { useCallback, useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import allLocales from '@fullcalendar/core/locales-all';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { Box } from '@mui/material';
import { useEventsContext } from '../common/EventsProvider';
import { MobileDateEventsDialog } from './MobileDateEventsDialog';
import { EventT } from '@/types/EventT';
import { isSameDay } from 'date-fns';
import { EventClickArg } from '@fullcalendar/core/index.js';

export const MobileMain = () => {
  const { events } = useEventsContext();
  const [isMobileDateEventsDialogOpen, setIsMobileDateEventsDialogOpen] =
    useState(false);
  const [date, setDate] = useState<Date>(); //モーダルに日付データを渡す

  const [dateEvents, setDateEvents] = useState<EventT[]>([]);

  useEffect(() => {
    if (!!date) {
      const clickedDateEvents = events.filter((event) => {
        return isSameDay(new Date(event.startDateTime), date);
      });
      setDateEvents(clickedDateEvents);
    } else {
      setDateEvents([]);
    }
  }, [events, date]);

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

  //日付モーダルopen時
  const handleDateClick = useCallback((info: DateClickArg) => {
    setIsMobileDateEventsDialogOpen(true);
    setDate(info.date);
  }, []);

  const handleEventClick = useCallback((arg: EventClickArg) => {
    if (!!arg.event.start) {
      setIsMobileDateEventsDialogOpen(true);
      setDate(arg.event.start);
    }
  }, []);

  //日付モーダルclose時
  const handleCloseDialog = useCallback(() => {
    setIsMobileDateEventsDialogOpen(false);
    setDate(undefined);
  }, []);

  return (
    <Box sx={{ padding: '12px' }}>
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
        eventClick={handleEventClick}
      />

      {!!date && (
        <MobileDateEventsDialog
          isOpen={isMobileDateEventsDialogOpen}
          onClose={handleCloseDialog}
          dateEvents={dateEvents}
          date={date}
        />
      )}
    </Box>
  );
};
