export type EventT = {
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
};
