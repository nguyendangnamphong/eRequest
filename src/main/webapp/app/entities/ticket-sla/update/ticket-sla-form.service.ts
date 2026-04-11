import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITicketSLA, NewTicketSLA } from '../ticket-sla.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITicketSLA for edit and NewTicketSLAFormGroupInput for create.
 */
type TicketSLAFormGroupInput = ITicketSLA | PartialWithRequiredKeyOf<NewTicketSLA>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITicketSLA | NewTicketSLA> = Omit<T, 'deadline' | 'remindAt'> & {
  deadline?: string | null;
  remindAt?: string | null;
};

type TicketSLAFormRawValue = FormValueOf<ITicketSLA>;

type NewTicketSLAFormRawValue = FormValueOf<NewTicketSLA>;

type TicketSLAFormDefaults = Pick<NewTicketSLA, 'id' | 'deadline' | 'remindAt'>;

type TicketSLAFormGroupContent = {
  id: FormControl<TicketSLAFormRawValue['id'] | NewTicketSLA['id']>;
  deadline: FormControl<TicketSLAFormRawValue['deadline']>;
  remindAt: FormControl<TicketSLAFormRawValue['remindAt']>;
  ticket: FormControl<TicketSLAFormRawValue['ticket']>;
};

export type TicketSLAFormGroup = FormGroup<TicketSLAFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TicketSLAFormService {
  createTicketSLAFormGroup(ticketSLA: TicketSLAFormGroupInput = { id: null }): TicketSLAFormGroup {
    const ticketSLARawValue = this.convertTicketSLAToTicketSLARawValue({
      ...this.getFormDefaults(),
      ...ticketSLA,
    });
    return new FormGroup<TicketSLAFormGroupContent>({
      id: new FormControl(
        { value: ticketSLARawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      deadline: new FormControl(ticketSLARawValue.deadline, {
        validators: [Validators.required],
      }),
      remindAt: new FormControl(ticketSLARawValue.remindAt),
      ticket: new FormControl(ticketSLARawValue.ticket),
    });
  }

  getTicketSLA(form: TicketSLAFormGroup): ITicketSLA | NewTicketSLA {
    return this.convertTicketSLARawValueToTicketSLA(form.getRawValue() as TicketSLAFormRawValue | NewTicketSLAFormRawValue);
  }

  resetForm(form: TicketSLAFormGroup, ticketSLA: TicketSLAFormGroupInput): void {
    const ticketSLARawValue = this.convertTicketSLAToTicketSLARawValue({ ...this.getFormDefaults(), ...ticketSLA });
    form.reset(
      {
        ...ticketSLARawValue,
        id: { value: ticketSLARawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TicketSLAFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      deadline: currentTime,
      remindAt: currentTime,
    };
  }

  private convertTicketSLARawValueToTicketSLA(rawTicketSLA: TicketSLAFormRawValue | NewTicketSLAFormRawValue): ITicketSLA | NewTicketSLA {
    return {
      ...rawTicketSLA,
      deadline: dayjs(rawTicketSLA.deadline, DATE_TIME_FORMAT),
      remindAt: dayjs(rawTicketSLA.remindAt, DATE_TIME_FORMAT),
    };
  }

  private convertTicketSLAToTicketSLARawValue(
    ticketSLA: ITicketSLA | (Partial<NewTicketSLA> & TicketSLAFormDefaults),
  ): TicketSLAFormRawValue | PartialWithRequiredKeyOf<NewTicketSLAFormRawValue> {
    return {
      ...ticketSLA,
      deadline: ticketSLA.deadline ? ticketSLA.deadline.format(DATE_TIME_FORMAT) : undefined,
      remindAt: ticketSLA.remindAt ? ticketSLA.remindAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
