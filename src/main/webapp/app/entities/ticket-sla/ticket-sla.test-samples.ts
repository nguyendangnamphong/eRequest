import dayjs from 'dayjs/esm';

import { ITicketSLA, NewTicketSLA } from './ticket-sla.model';

export const sampleWithRequiredData: ITicketSLA = {
  id: 3108,
  deadline: dayjs('2026-04-10T12:43'),
};

export const sampleWithPartialData: ITicketSLA = {
  id: 16964,
  deadline: dayjs('2026-04-10T10:42'),
};

export const sampleWithFullData: ITicketSLA = {
  id: 22239,
  deadline: dayjs('2026-04-11T05:57'),
  remindAt: dayjs('2026-04-10T11:24'),
};

export const sampleWithNewData: NewTicketSLA = {
  deadline: dayjs('2026-04-10T09:13'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
