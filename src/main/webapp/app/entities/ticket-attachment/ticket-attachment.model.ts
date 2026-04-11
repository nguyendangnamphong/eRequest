import { ITicket } from 'app/entities/ticket/ticket.model';

export interface ITicketAttachment {
  id: number;
  fileId?: string | null;
  fileName?: string | null;
  ticket?: ITicket | null;
}

export type NewTicketAttachment = Omit<ITicketAttachment, 'id'> & { id: null };
