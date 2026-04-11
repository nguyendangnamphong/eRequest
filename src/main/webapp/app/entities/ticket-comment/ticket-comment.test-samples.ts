import dayjs from 'dayjs/esm';

import { ITicketComment, NewTicketComment } from './ticket-comment.model';

export const sampleWithRequiredData: ITicketComment = {
  id: 26727,
  authorEmail: 'inasmuch',
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithPartialData: ITicketComment = {
  id: 13886,
  authorEmail: 'who',
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: ITicketComment = {
  id: 29810,
  authorEmail: 'elegantly if',
  content: '../fake-data/blob/hipster.txt',
  createdAt: dayjs('2026-04-10T15:24'),
};

export const sampleWithNewData: NewTicketComment = {
  authorEmail: 'jeopardise rebel under',
  content: '../fake-data/blob/hipster.txt',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
