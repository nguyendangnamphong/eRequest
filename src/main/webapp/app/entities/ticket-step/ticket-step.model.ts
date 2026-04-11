import dayjs from 'dayjs/esm';
import { ITicketSLA } from 'app/entities/ticket-sla/ticket-sla.model';
import { ITicket } from 'app/entities/ticket/ticket.model';

export interface ITicketStep {
  id: number;
  nodeId?: number | null;
  performerEmail?: string | null;
  status?: number | null;
  startedAt?: dayjs.Dayjs | null;
  finishedAt?: dayjs.Dayjs | null;
  sla?: ITicketSLA | null;
  ticket?: ITicket | null;
}

export type NewTicketStep = Omit<ITicketStep, 'id'> & { id: null };
