import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITicketRelation, NewTicketRelation } from '../ticket-relation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITicketRelation for edit and NewTicketRelationFormGroupInput for create.
 */
type TicketRelationFormGroupInput = ITicketRelation | PartialWithRequiredKeyOf<NewTicketRelation>;

type TicketRelationFormDefaults = Pick<NewTicketRelation, 'id'>;

type TicketRelationFormGroupContent = {
  id: FormControl<ITicketRelation['id'] | NewTicketRelation['id']>;
  relatedTicketId: FormControl<ITicketRelation['relatedTicketId']>;
  ticket: FormControl<ITicketRelation['ticket']>;
};

export type TicketRelationFormGroup = FormGroup<TicketRelationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TicketRelationFormService {
  createTicketRelationFormGroup(ticketRelation: TicketRelationFormGroupInput = { id: null }): TicketRelationFormGroup {
    const ticketRelationRawValue = {
      ...this.getFormDefaults(),
      ...ticketRelation,
    };
    return new FormGroup<TicketRelationFormGroupContent>({
      id: new FormControl(
        { value: ticketRelationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      relatedTicketId: new FormControl(ticketRelationRawValue.relatedTicketId, {
        validators: [Validators.required],
      }),
      ticket: new FormControl(ticketRelationRawValue.ticket),
    });
  }

  getTicketRelation(form: TicketRelationFormGroup): ITicketRelation | NewTicketRelation {
    return form.getRawValue() as ITicketRelation | NewTicketRelation;
  }

  resetForm(form: TicketRelationFormGroup, ticketRelation: TicketRelationFormGroupInput): void {
    const ticketRelationRawValue = { ...this.getFormDefaults(), ...ticketRelation };
    form.reset(
      {
        ...ticketRelationRawValue,
        id: { value: ticketRelationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TicketRelationFormDefaults {
    return {
      id: null,
    };
  }
}
