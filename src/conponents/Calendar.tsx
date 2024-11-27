import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Calendar } from '@fullcalendar/core/index.js';


export const NeneCalendar =()=> {
  return (
    <div>
      <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth"   weekends={false}
  events={[
    { title: 'event 1', date: '2024-11-15' },
    { title: 'event 2', date: '2019-04-02' }
  ]}/>
    </div>
  );
}
