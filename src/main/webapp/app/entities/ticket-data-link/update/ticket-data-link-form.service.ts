import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITicketDataLink, NewTicketDataLink } from '../ticket-data-link.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITicketDataLink for edit and NewTicketDataLinkFormGroupInput for create.
 */
type TicketDataLinkFormGroupInput = ITicketDataLink | PartialWithRequiredKeyOf<NewTicketDataLink>;

type TicketDataLinkFormDefaults = Pick<NewTicketDataLink, 'id'>;

type TicketDataLinkFormGroupContent = {
  id: FormControl<ITicketDataLink['id'] | NewTicketDataLink['id']>;
  nodeId: FormControl<ITicketDataLink['nodeId']>;
  formDataId: FormControl<ITicketDataLink['formDataId']>;
  parentFormDataId: FormControl<ITicketDataLink['parentFormDataId']>;
  ticket: FormControl<ITicketDataLink['ticket']>;
};

export type TicketDataLinkFormGroup = FormGroup<TicketDataLinkFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TicketDataLinkFormService {
  createTicketDataLinkFormGroup(ticketDataLink: TicketDataLinkFormGroupInput = { id: null }): TicketDataLinkFormGroup {
    const ticketDataLinkRawValue = {
      ...this.getFormDefaults(),
      ...ticketDataLink,
    };
    return new FormGroup<TicketDataLinkFormGroupContent>({
      id: new FormControl(
        { value: ticketDataLinkRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nodeId: new FormControl(ticketDataLinkRawValue.nodeId, {
        validators: [Validators.required],
      }),
      formDataId: new FormControl(ticketDataLinkRawValue.formDataId, {
        validators: [Validators.required],
      }),
      parentFormDataId: new FormControl(ticketDataLinkRawValue.parentFormDataId),
      ticket: new FormControl(ticketDataLinkRawValue.ticket),
    });
  }

  getTicketDataLink(form: TicketDataLinkFormGroup): ITicketDataLink | NewTicketDataLink {
    return form.getRawValue() as ITicketDataLink | NewTicketDataLink;
  }

  resetForm(form: TicketDataLinkFormGroup, ticketDataLink: TicketDataLinkFormGroupInput): void {
    const ticketDataLinkRawValue = { ...this.getFormDefaults(), ...ticketDataLink };
    form.reset(
      {
        ...ticketDataLinkRawValue,
        id: { value: ticketDataLinkRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TicketDataLinkFormDefaults {
    return {
      id: null,
    };
  }
}
