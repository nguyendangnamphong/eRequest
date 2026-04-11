import dayjs from 'dayjs/esm';

import { ITicket, NewTicket } from './ticket.model';

export const sampleWithRequiredData: ITicket = {
  id: 8875,
  flowId: 3091,
  ticketName: 'likewise weakly clueless',
  creatorEmail: 'putrid surprisingly',
  status: 8296,
  version: 32679,
};

export const sampleWithPartialData: ITicket = {
  id: 19880,
  flowId: 22329,
  ticketName: 'cannon access',
  creatorEmail: 'nerve',
  currentStepId: 16777,
  status: 10766,
  priority: 22835,
  version: 16197,
  updatedAt: dayjs('2026-04-11T01:17'),
};

export const sampleWithFullData: ITicket = {
  id: 25743,
  flowId: 31099,
  ticketName: 'frail whether cleaner',
  creatorEmail: 'amongst',
  currentStepId: 4071,
  status: 23948,
  priority: 30911,
  version: 501,
  createdAt: dayjs('2026-04-10T07:04'),
  updatedAt: dayjs('2026-04-10T20:52'),
  completedAt: dayjs('2026-04-10T17:47'),
};

export const sampleWithNewData: NewTicket = {
  flowId: 6107,
  ticketName: 'instead an old',
  creatorEmail: 'along for regularly',
  status: 7974,
  version: 2471,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
