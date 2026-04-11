import dayjs from 'dayjs/esm';
import { ITicket } from 'app/entities/ticket/ticket.model';

export interface ITicketComment {
  id: number;
  authorEmail?: string | null;
  content?: string | null;
  createdAt?: dayjs.Dayjs | null;
  ticket?: ITicket | null;
}

export type NewTicketComment = Omit<ITicketComment, 'id'> & { id: null };
