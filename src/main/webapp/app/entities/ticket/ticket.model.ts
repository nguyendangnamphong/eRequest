import dayjs from 'dayjs/esm';

export interface ITicket {
  id: number;
  flowId?: number | null;
  ticketName?: string | null;
  creatorEmail?: string | null;
  currentStepId?: number | null;
  status?: number | null;
  priority?: number | null;
  version?: number | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  completedAt?: dayjs.Dayjs | null;
}

export type NewTicket = Omit<ITicket, 'id'> & { id: null };
