import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITicketComment, NewTicketComment } from '../ticket-comment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITicketComment for edit and NewTicketCommentFormGroupInput for create.
 */
type TicketCommentFormGroupInput = ITicketComment | PartialWithRequiredKeyOf<NewTicketComment>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITicketComment | NewTicketComment> = Omit<T, 'createdAt'> & {
  createdAt?: string | null;
};

type TicketCommentFormRawValue = FormValueOf<ITicketComment>;

type NewTicketCommentFormRawValue = FormValueOf<NewTicketComment>;

type TicketCommentFormDefaults = Pick<NewTicketComment, 'id' | 'createdAt'>;

type TicketCommentFormGroupContent = {
  id: FormControl<TicketCommentFormRawValue['id'] | NewTicketComment['id']>;
  authorEmail: FormControl<TicketCommentFormRawValue['authorEmail']>;
  content: FormControl<TicketCommentFormRawValue['content']>;
  createdAt: FormControl<TicketCommentFormRawValue['createdAt']>;
  ticket: FormControl<TicketCommentFormRawValue['ticket']>;
};

export type TicketCommentFormGroup = FormGroup<TicketCommentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TicketCommentFormService {
  createTicketCommentFormGroup(ticketComment: TicketCommentFormGroupInput = { id: null }): TicketCommentFormGroup {
    const ticketCommentRawValue = this.convertTicketCommentToTicketCommentRawValue({
      ...this.getFormDefaults(),
      ...ticketComment,
    });
    return new FormGroup<TicketCommentFormGroupContent>({
      id: new FormControl(
        { value: ticketCommentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      authorEmail: new FormControl(ticketCommentRawValue.authorEmail, {
        validators: [Validators.required],
      }),
      content: new FormControl(ticketCommentRawValue.content, {
        validators: [Validators.required],
      }),
      createdAt: new FormControl(ticketCommentRawValue.createdAt),
      ticket: new FormControl(ticketCommentRawValue.ticket),
    });
  }

  getTicketComment(form: TicketCommentFormGroup): ITicketComment | NewTicketComment {
    return this.convertTicketCommentRawValueToTicketComment(form.getRawValue() as TicketCommentFormRawValue | NewTicketCommentFormRawValue);
  }

  resetForm(form: TicketCommentFormGroup, ticketComment: TicketCommentFormGroupInput): void {
    const ticketCommentRawValue = this.convertTicketCommentToTicketCommentRawValue({ ...this.getFormDefaults(), ...ticketComment });
    form.reset(
      {
        ...ticketCommentRawValue,
        id: { value: ticketCommentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TicketCommentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
    };
  }

  private convertTicketCommentRawValueToTicketComment(
    rawTicketComment: TicketCommentFormRawValue | NewTicketCommentFormRawValue,
  ): ITicketComment | NewTicketComment {
    return {
      ...rawTicketComment,
      createdAt: dayjs(rawTicketComment.createdAt, DATE_TIME_FORMAT),
    };
  }

  private convertTicketCommentToTicketCommentRawValue(
    ticketComment: ITicketComment | (Partial<NewTicketComment> & TicketCommentFormDefaults),
  ): TicketCommentFormRawValue | PartialWithRequiredKeyOf<NewTicketCommentFormRawValue> {
    return {
      ...ticketComment,
      createdAt: ticketComment.createdAt ? ticketComment.createdAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
