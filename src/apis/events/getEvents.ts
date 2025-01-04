import { GetEventsResponseSuccessBody } from '@/pages/api/events';
import axios from 'axios';

export const getEvents = ({
  startDateTime,
  endDateTime,
}: {
  startDateTime: Date;
  endDateTime: Date;
}) => {
  // クエリを設定する為にURLSearchParamsを使う
  const params = new URLSearchParams();

  // startOfMonthDateのある月の1日をスタートとする
  params.set('startDateTime', startDateTime.toISOString());

  params.set('endDateTime', endDateTime.toISOString());
  return (
    axios
      // params.toString()を行うと、もしparamsに何も設定されていない場合は""が返る
      // 設定されていた場合は、key=valueの形で返ってくる
      //  例： http://localhost:3000/api/events?startDateTime=2024-12-31T15%3A00%3A00.000Z&endDateTime=2025-01-31T14%3A59%3A59.999Z
      .get<GetEventsResponseSuccessBody>(`/api/events?${params.toString()}`)
  );
};
