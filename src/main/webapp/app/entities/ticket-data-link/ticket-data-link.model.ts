import { ITicket } from 'app/entities/ticket/ticket.model';

export interface ITicketDataLink {
  id: number;
  nodeId?: number | null;
  formDataId?: string | null;
  parentFormDataId?: string | null;
  ticket?: ITicket | null;
}

export type NewTicketDataLink = Omit<ITicketDataLink, 'id'> & { id: null };
