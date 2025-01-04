import {
  PatchEventRequestBody,
  PatchEventResponseSuccessBody,
} from '@/pages/api/events/[id]';
import axios from 'axios';

export const patchEvent = ({
  eventId,
  patchData,
}: {
  eventId: number;
  patchData: PatchEventRequestBody;
}) => {
  return axios.patch<PatchEventResponseSuccessBody>(
    `/api/events/${eventId}`,
    patchData
  );
};

// (
//   eventId: number;
//   patchData: PatchEventRequestBody;
// )
