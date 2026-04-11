import { ITicket } from 'app/entities/ticket/ticket.model';

export interface ITicketRelation {
  id: number;
  relatedTicketId?: number | null;
  ticket?: ITicket | null;
}

export type NewTicketRelation = Omit<ITicketRelation, 'id'> & { id: null };
