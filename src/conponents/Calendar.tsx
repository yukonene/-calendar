import { useCallback, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import allLocales from '@fullcalendar/core/locales-all';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

import { Box } from '@mui/material';
import axios from 'axios';

export const NeneCalendar = () => {
  const handleDateClick = useCallback((info: DateClickArg) => {
    alert('Clicked on: ' + info.dateStr);
  }, []);
  useEffect(() => {
    axios
      .get('http://localhost:3000')
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((e) => {
        console.log(e.message);
      });
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
    </Box>
  );
};

// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import { Calendar } from '@fullcalendar/core/index.js';

// export const NeneCalendar = () => {
//   return (
//     <div>
//       <FullCalendar
//         plugins={[dayGridPlugin]}
//         initialView="dayGridMonth"
//         weekends={false}
//         events={[
//           { title: 'event 1', date: '2024-11-15' },
//           { title: 'event 2', date: '2019-04-02' },
//         ]}
//       />
//     </div>
//   );
// };
