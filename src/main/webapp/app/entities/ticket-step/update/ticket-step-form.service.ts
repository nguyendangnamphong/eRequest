import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITicketStep, NewTicketStep } from '../ticket-step.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITicketStep for edit and NewTicketStepFormGroupInput for create.
 */
type TicketStepFormGroupInput = ITicketStep | PartialWithRequiredKeyOf<NewTicketStep>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITicketStep | NewTicketStep> = Omit<T, 'startedAt' | 'finishedAt'> & {
  startedAt?: string | null;
  finishedAt?: string | null;
};

type TicketStepFormRawValue = FormValueOf<ITicketStep>;

type NewTicketStepFormRawValue = FormValueOf<NewTicketStep>;

type TicketStepFormDefaults = Pick<NewTicketStep, 'id' | 'startedAt' | 'finishedAt'>;

type TicketStepFormGroupContent = {
  id: FormControl<TicketStepFormRawValue['id'] | NewTicketStep['id']>;
  nodeId: FormControl<TicketStepFormRawValue['nodeId']>;
  performerEmail: FormControl<TicketStepFormRawValue['performerEmail']>;
  status: FormControl<TicketStepFormRawValue['status']>;
  startedAt: FormControl<TicketStepFormRawValue['startedAt']>;
  finishedAt: FormControl<TicketStepFormRawValue['finishedAt']>;
  sla: FormControl<TicketStepFormRawValue['sla']>;
  ticket: FormControl<TicketStepFormRawValue['ticket']>;
};

export type TicketStepFormGroup = FormGroup<TicketStepFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TicketStepFormService {
  createTicketStepFormGroup(ticketStep: TicketStepFormGroupInput = { id: null }): TicketStepFormGroup {
    const ticketStepRawValue = this.convertTicketStepToTicketStepRawValue({
      ...this.getFormDefaults(),
      ...ticketStep,
    });
    return new FormGroup<TicketStepFormGroupContent>({
      id: new FormControl(
        { value: ticketStepRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nodeId: new FormControl(ticketStepRawValue.nodeId, {
        validators: [Validators.required],
      }),
      performerEmail: new FormControl(ticketStepRawValue.performerEmail, {
        validators: [Validators.required],
      }),
      status: new FormControl(ticketStepRawValue.status, {
        validators: [Validators.required],
      }),
      startedAt: new FormControl(ticketStepRawValue.startedAt),
      finishedAt: new FormControl(ticketStepRawValue.finishedAt),
      sla: new FormControl(ticketStepRawValue.sla),
      ticket: new FormControl(ticketStepRawValue.ticket),
    });
  }

  getTicketStep(form: TicketStepFormGroup): ITicketStep | NewTicketStep {
    return this.convertTicketStepRawValueToTicketStep(form.getRawValue() as TicketStepFormRawValue | NewTicketStepFormRawValue);
  }

  resetForm(form: TicketStepFormGroup, ticketStep: TicketStepFormGroupInput): void {
    const ticketStepRawValue = this.convertTicketStepToTicketStepRawValue({ ...this.getFormDefaults(), ...ticketStep });
    form.reset(
      {
        ...ticketStepRawValue,
        id: { value: ticketStepRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TicketStepFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startedAt: currentTime,
      finishedAt: currentTime,
    };
  }

  private convertTicketStepRawValueToTicketStep(
    rawTicketStep: TicketStepFormRawValue | NewTicketStepFormRawValue,
  ): ITicketStep | NewTicketStep {
    return {
      ...rawTicketStep,
      startedAt: dayjs(rawTicketStep.startedAt, DATE_TIME_FORMAT),
      finishedAt: dayjs(rawTicketStep.finishedAt, DATE_TIME_FORMAT),
    };
  }

  private convertTicketStepToTicketStepRawValue(
    ticketStep: ITicketStep | (Partial<NewTicketStep> & TicketStepFormDefaults),
  ): TicketStepFormRawValue | PartialWithRequiredKeyOf<NewTicketStepFormRawValue> {
    return {
      ...ticketStep,
      startedAt: ticketStep.startedAt ? ticketStep.startedAt.format(DATE_TIME_FORMAT) : undefined,
      finishedAt: ticketStep.finishedAt ? ticketStep.finishedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
