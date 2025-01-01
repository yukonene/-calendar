import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import allLocales from '@fullcalendar/core/locales-all';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { Box } from '@mui/material';
import { NewEventDialog } from '../common/new_event_dialog/NewEventDialog';
import { EventClickArg } from '@fullcalendar/core/index.js';
import { useEventsContext } from '../common/EventsProvider';

type Props = {
  setEventId: Dispatch<SetStateAction<number | undefined>>;
};

export const DesktopNeneCalendar = ({ setEventId }: Props) => {
  const { events } = useEventsContext();
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
  const [date, setDate] = useState<Date>(); //モーダルに日付データを渡す

  const { getEvents } = useEventsContext();

  //イベント作成モーダルopen時
  const handleDateClick = useCallback((info: DateClickArg) => {
    setIsNewEventDialogOpen(true);
    setDate(info.date);
  }, []);
  //イベント作成モーダルclose時
  const handleCloseDialog = useCallback(() => {
    setIsNewEventDialogOpen(false);
    setDate(undefined);
  }, []);

  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      setEventId(Number(info.event.id));
    },
    [setEventId]
  );

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

  return (
    <Box sx={{ height: '100%' }}>
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

      <NewEventDialog //イベント登録モーダル
        isOpen={isNewEventDialogOpen}
        onClose={handleCloseDialog}
        date={date}
        afterSaveEvent={getEvents}
      />
    </Box>
  );
};
