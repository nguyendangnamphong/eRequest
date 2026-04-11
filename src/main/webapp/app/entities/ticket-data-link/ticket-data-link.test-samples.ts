import { ITicketDataLink, NewTicketDataLink } from './ticket-data-link.model';

export const sampleWithRequiredData: ITicketDataLink = {
  id: 10300,
  nodeId: 11283,
  formDataId: 'reassemble as',
};

export const sampleWithPartialData: ITicketDataLink = {
  id: 7784,
  nodeId: 26457,
  formDataId: 'rejoin absent though',
};

export const sampleWithFullData: ITicketDataLink = {
  id: 8144,
  nodeId: 11654,
  formDataId: 'afore celebrated',
  parentFormDataId: 'outnumber plus',
};

export const sampleWithNewData: NewTicketDataLink = {
  nodeId: 3237,
  formDataId: 'impressionable inasmuch',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
