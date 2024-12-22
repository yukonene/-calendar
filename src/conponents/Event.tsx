import { GetEventResponseSuccessBody } from '@/pages/api/events/[id]';
import { Box } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { EditEventModal } from './edit_event_modal/EditEventModal';

type Props = {
  eventId: number | undefined;
};

export const Event = ({ eventId }: Props) => {
  const [event, setEvent] = useState<{
    id: number;
    title: string;
    startDateTime: string;
    endDateTime: string | null;
    place: string | null;
    url: string | null;
    member: string | null;
    memo: string | null;
    diary: string | null;
    success: true | null;
  }>();
  const getEvent = useCallback(() => {
    if (!eventId) {
      return;
    } else {
      axios
        .get<GetEventResponseSuccessBody>(`/api/events/${eventId}`)
        .then((res) => {
          setEvent(res.data.event); //GetEventsResponseSuccessBody=res.data
        })

        .catch((e) => {
          console.log(e.message);
        });
    }
  }, [eventId]);

  useEffect(() => {
    getEvent();
  }, [eventId]);

  const [editEventModalOpen, SetEditEventModalOpen] = useState(false);
  useCallback(() => {
    SetEditEventModalOpen(true);
  }, []);

  return (
    <Box>
      <Box>
        {!!event ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* タイトル */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box component={'label'} sx={{ fontSize: 'small' }}>
                イベントタイトル
              </Box>
              <Box>{event.title}</Box>
            </Box>

            {/* イベント日時 */}
            <Box sx={{ display: 'flex' }}>
              <Box>
                {format(new Date(event.startDateTime), ' MM月dd日HH時mm分')}
              </Box>
              <Box>
                {!!event.endDateTime &&
                  format(new Date(event.endDateTime), '~ MM月dd日HH時mm分')}
              </Box>
            </Box>

            {/* 開催場所 */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box component={'label'} sx={{ fontSize: 'small' }}>
                {!!event.place && '開催場所'}
              </Box>
              <Box>{!!event.place && event.place}</Box>
            </Box>

            {/* URL */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box component={'label'} sx={{ fontSize: 'small' }}>
                {!!event.url && 'URL'}
              </Box>
              <Box>{!!event.url && event.url}</Box>
            </Box>

            {/* メンバー */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box component={'label'} sx={{ fontSize: 'small' }}>
                {!!event.member && '同行メンバー'}
              </Box>
              <Box>{!!event.member && event.member}</Box>
            </Box>

            {/* memo */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box component={'label'} sx={{ fontSize: 'small' }}>
                {!!event.memo && '詳細'}
              </Box>
              <Box>{!!event.memo && event.memo}</Box>
            </Box>

            {/* 日記 */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box component={'label'} sx={{ fontSize: 'small' }}>
                {!!event.diary && 'イベントレポート'}
              </Box>
              <Box>{!!event.diary && event.diary}</Box>
            </Box>

            {/* 成功・失敗 */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box component={'label'}>{event.success != null && '脱出'}</Box>
              <Box>
                {/* null undefined以外 */}
                {event.success != null && (event.success ? '成功' : '失敗')}
              </Box>
            </Box>
            <EditEventModal
              event={event}
              isOpen={editEventModalOpen}
              onClose={() => SetEditEventModalOpen(false)}
              getEvent={getEvent}
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};
