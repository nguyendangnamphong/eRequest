import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITicketAttachment, NewTicketAttachment } from '../ticket-attachment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITicketAttachment for edit and NewTicketAttachmentFormGroupInput for create.
 */
type TicketAttachmentFormGroupInput = ITicketAttachment | PartialWithRequiredKeyOf<NewTicketAttachment>;

type TicketAttachmentFormDefaults = Pick<NewTicketAttachment, 'id'>;

type TicketAttachmentFormGroupContent = {
  id: FormControl<ITicketAttachment['id'] | NewTicketAttachment['id']>;
  fileId: FormControl<ITicketAttachment['fileId']>;
  fileName: FormControl<ITicketAttachment['fileName']>;
  ticket: FormControl<ITicketAttachment['ticket']>;
};

export type TicketAttachmentFormGroup = FormGroup<TicketAttachmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TicketAttachmentFormService {
  createTicketAttachmentFormGroup(ticketAttachment: TicketAttachmentFormGroupInput = { id: null }): TicketAttachmentFormGroup {
    const ticketAttachmentRawValue = {
      ...this.getFormDefaults(),
      ...ticketAttachment,
    };
    return new FormGroup<TicketAttachmentFormGroupContent>({
      id: new FormControl(
        { value: ticketAttachmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      fileId: new FormControl(ticketAttachmentRawValue.fileId, {
        validators: [Validators.required],
      }),
      fileName: new FormControl(ticketAttachmentRawValue.fileName),
      ticket: new FormControl(ticketAttachmentRawValue.ticket),
    });
  }

  getTicketAttachment(form: TicketAttachmentFormGroup): ITicketAttachment | NewTicketAttachment {
    return form.getRawValue() as ITicketAttachment | NewTicketAttachment;
  }

  resetForm(form: TicketAttachmentFormGroup, ticketAttachment: TicketAttachmentFormGroupInput): void {
    const ticketAttachmentRawValue = { ...this.getFormDefaults(), ...ticketAttachment };
    form.reset(
      {
        ...ticketAttachmentRawValue,
        id: { value: ticketAttachmentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TicketAttachmentFormDefaults {
    return {
      id: null,
    };
  }
}
