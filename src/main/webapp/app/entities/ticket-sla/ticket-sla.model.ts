import dayjs from 'dayjs/esm';
import { ITicket } from 'app/entities/ticket/ticket.model';

export interface ITicketSLA {
  id: number;
  deadline?: dayjs.Dayjs | null;
  remindAt?: dayjs.Dayjs | null;
  ticket?: ITicket | null;
}

export type NewTicketSLA = Omit<ITicketSLA, 'id'> & { id: null };
