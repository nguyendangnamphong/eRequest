import { ITicketAttachment, NewTicketAttachment } from './ticket-attachment.model';

export const sampleWithRequiredData: ITicketAttachment = {
  id: 19177,
  fileId: 'exalted',
};

export const sampleWithPartialData: ITicketAttachment = {
  id: 5682,
  fileId: 'phew',
  fileName: 'inasmuch',
};

export const sampleWithFullData: ITicketAttachment = {
  id: 25505,
  fileId: 'gee violin',
  fileName: 'now throughout harvest',
};

export const sampleWithNewData: NewTicketAttachment = {
  fileId: 'excepting',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
