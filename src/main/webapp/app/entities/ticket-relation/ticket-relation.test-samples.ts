import { ITicketRelation, NewTicketRelation } from './ticket-relation.model';

export const sampleWithRequiredData: ITicketRelation = {
  id: 32433,
  relatedTicketId: 2252,
};

export const sampleWithPartialData: ITicketRelation = {
  id: 6752,
  relatedTicketId: 5074,
};

export const sampleWithFullData: ITicketRelation = {
  id: 1437,
  relatedTicketId: 18773,
};

export const sampleWithNewData: NewTicketRelation = {
  relatedTicketId: 25799,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
