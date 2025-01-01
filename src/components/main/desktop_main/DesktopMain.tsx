import { Box } from '@mui/material';
import { DesktopNeneCalendar } from './DesktopNeneCalendar';
import { DesktopEvent } from './DesktopEvent';
import { useState } from 'react';

export const DesktopMain = () => {
  const [eventId, setEventId] = useState<number>();

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
      }}
    >
      {/* カレンダー */}
      <Box
        sx={{
          padding: '25px',
          width: '50%',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <DesktopNeneCalendar setEventId={setEventId} />
      </Box>
      {/* イベント詳細 */}
      <Box
        sx={{
          padding: '25px',
          width: '50%',
          overflowY: 'auto',
          height: '100%',
        }}
      >
        {!!eventId && <DesktopEvent eventId={eventId} />}
      </Box>
    </Box>
  );
};
