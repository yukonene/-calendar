import { useCallback, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import allLocales from '@fullcalendar/core/locales-all';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

import { Box, Button } from '@mui/material';
import axios from 'axios';
import { NewEventModal } from './new_event_modal/NewEventModal';

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
  // useEffect(() => {
  //   axios
  //     .get('http://localhost:3000')
  //     .then((response) => {
  //       console.log(response.data.message);
  //     })
  //     .catch((e) => {
  //       console.log(e.message);
  //     });
  // }, []);
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
        // events={{
        //   url: `/api/schedule/`,
        //   method: 'GET',
        //   extraParams: () => {}, // サーバーに送信するその他の GET/POST データ。key: valueの形式で書く
        //   failure: (error) => {
        //     //エラーの時に書くもの
        //     console.log(error);
        //   },
        // }}
        dateClick={handleDateClick}
      />

      <NewEventModal //イベント登録モーダル
        isOpen={isNewEventModalOpen}
        onClose={handleCloseModal}
        date={date}
      />
    </Box>
  );
};
