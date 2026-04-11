import dayjs from 'dayjs/esm';

import { ITicketStep, NewTicketStep } from './ticket-step.model';

export const sampleWithRequiredData: ITicketStep = {
  id: 19268,
  nodeId: 22922,
  performerEmail: 'claw',
  status: 25044,
};

export const sampleWithPartialData: ITicketStep = {
  id: 24481,
  nodeId: 6936,
  performerEmail: 'who',
  status: 13024,
  finishedAt: dayjs('2026-04-11T03:58'),
};

export const sampleWithFullData: ITicketStep = {
  id: 19154,
  nodeId: 27365,
  performerEmail: 'under',
  status: 16095,
  startedAt: dayjs('2026-04-10T09:39'),
  finishedAt: dayjs('2026-04-10T23:45'),
};

export const sampleWithNewData: NewTicketStep = {
  nodeId: 24968,
  performerEmail: 'mountain',
  status: 20955,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
