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
import { EventPhotoT } from '@/types/EventPhotoT';

export const MobileMain = () => {
  const { eventInfoList, handlePrevButton, handleNextButton, calendarRef } =
    useEventsContext();
  const [isMobileDateEventsDialogOpen, setIsMobileDateEventsDialogOpen] =
    useState(false);
  const [date, setDate] = useState<Date>(); //モーダルに日付データを渡す

  const [dateEventInfoList, setDateEventInfoList] = useState<
    {
      event: EventT;
      eventPhotos: EventPhotoT[];
    }[]
  >([]);

  useEffect(() => {
    if (!!date) {
      const clickedDateEvents = eventInfoList.filter((eventInfo) => {
        return isSameDay(new Date(eventInfo.event.startDateTime), date);
      });
      setDateEventInfoList(clickedDateEvents);
    } else {
      setDateEventInfoList([]);
    }
  }, [eventInfoList, date]);

  const eventList = useMemo(() => {
    return eventInfoList.map((eventInfo) => {
      return {
        id: eventInfo.event.id.toString(), //typeを文字列に変換
        title: eventInfo.event.title,
        start: new Date(eventInfo.event.startDateTime),
        end: !!eventInfo.event.endDateTime
          ? new Date(eventInfo.event.endDateTime)
          : undefined,
      };
    });
  }, [eventInfoList]);

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
        ref={calendarRef}
        customButtons={{
          prevWithOnClick: {
            text: '<',
            click: handlePrevButton,
          },
          nextWithOnClick: {
            text: '>',
            click: handleNextButton,
          },
        }}
        headerToolbar={{
          left: 'title',
          center: '',
          right: 'prevWithOnClick,nextWithOnClick',
        }}
      />

      {!!date && (
        <MobileDateEventsDialog
          isOpen={isMobileDateEventsDialogOpen}
          onClose={handleCloseDialog}
          dateEventInfoList={dateEventInfoList}
          date={date}
        />
      )}
    </Box>
  );
};
