import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITicket, NewTicket } from '../ticket.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITicket for edit and NewTicketFormGroupInput for create.
 */
type TicketFormGroupInput = ITicket | PartialWithRequiredKeyOf<NewTicket>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITicket | NewTicket> = Omit<T, 'createdAt' | 'updatedAt' | 'completedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  completedAt?: string | null;
};

type TicketFormRawValue = FormValueOf<ITicket>;

type NewTicketFormRawValue = FormValueOf<NewTicket>;

type TicketFormDefaults = Pick<NewTicket, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>;

type TicketFormGroupContent = {
  id: FormControl<TicketFormRawValue['id'] | NewTicket['id']>;
  flowId: FormControl<TicketFormRawValue['flowId']>;
  ticketName: FormControl<TicketFormRawValue['ticketName']>;
  creatorEmail: FormControl<TicketFormRawValue['creatorEmail']>;
  currentStepId: FormControl<TicketFormRawValue['currentStepId']>;
  status: FormControl<TicketFormRawValue['status']>;
  priority: FormControl<TicketFormRawValue['priority']>;
  version: FormControl<TicketFormRawValue['version']>;
  createdAt: FormControl<TicketFormRawValue['createdAt']>;
  updatedAt: FormControl<TicketFormRawValue['updatedAt']>;
  completedAt: FormControl<TicketFormRawValue['completedAt']>;
};

export type TicketFormGroup = FormGroup<TicketFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TicketFormService {
  createTicketFormGroup(ticket: TicketFormGroupInput = { id: null }): TicketFormGroup {
    const ticketRawValue = this.convertTicketToTicketRawValue({
      ...this.getFormDefaults(),
      ...ticket,
    });
    return new FormGroup<TicketFormGroupContent>({
      id: new FormControl(
        { value: ticketRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      flowId: new FormControl(ticketRawValue.flowId, {
        validators: [Validators.required],
      }),
      ticketName: new FormControl(ticketRawValue.ticketName, {
        validators: [Validators.required],
      }),
      creatorEmail: new FormControl(ticketRawValue.creatorEmail, {
        validators: [Validators.required],
      }),
      currentStepId: new FormControl(ticketRawValue.currentStepId),
      status: new FormControl(ticketRawValue.status, {
        validators: [Validators.required],
      }),
      priority: new FormControl(ticketRawValue.priority),
      version: new FormControl(ticketRawValue.version, {
        validators: [Validators.required],
      }),
      createdAt: new FormControl(ticketRawValue.createdAt),
      updatedAt: new FormControl(ticketRawValue.updatedAt),
      completedAt: new FormControl(ticketRawValue.completedAt),
    });
  }

  getTicket(form: TicketFormGroup): ITicket | NewTicket {
    return this.convertTicketRawValueToTicket(form.getRawValue() as TicketFormRawValue | NewTicketFormRawValue);
  }

  resetForm(form: TicketFormGroup, ticket: TicketFormGroupInput): void {
    const ticketRawValue = this.convertTicketToTicketRawValue({ ...this.getFormDefaults(), ...ticket });
    form.reset(
      {
        ...ticketRawValue,
        id: { value: ticketRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TicketFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
      completedAt: currentTime,
    };
  }

  private convertTicketRawValueToTicket(rawTicket: TicketFormRawValue | NewTicketFormRawValue): ITicket | NewTicket {
    return {
      ...rawTicket,
      createdAt: dayjs(rawTicket.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawTicket.updatedAt, DATE_TIME_FORMAT),
      completedAt: dayjs(rawTicket.completedAt, DATE_TIME_FORMAT),
    };
  }

  private convertTicketToTicketRawValue(
    ticket: ITicket | (Partial<NewTicket> & TicketFormDefaults),
  ): TicketFormRawValue | PartialWithRequiredKeyOf<NewTicketFormRawValue> {
    return {
      ...ticket,
      createdAt: ticket.createdAt ? ticket.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: ticket.updatedAt ? ticket.updatedAt.format(DATE_TIME_FORMAT) : undefined,
      completedAt: ticket.completedAt ? ticket.completedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
