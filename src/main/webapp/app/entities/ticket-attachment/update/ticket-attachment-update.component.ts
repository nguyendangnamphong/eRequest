import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITicket } from 'app/entities/ticket/ticket.model';
import { TicketService } from 'app/entities/ticket/service/ticket.service';
import { ITicketAttachment } from '../ticket-attachment.model';
import { TicketAttachmentService } from '../service/ticket-attachment.service';
import { TicketAttachmentFormGroup, TicketAttachmentFormService } from './ticket-attachment-form.service';

@Component({
  standalone: true,
  selector: 'jhi-ticket-attachment-update',
  templateUrl: './ticket-attachment-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TicketAttachmentUpdateComponent implements OnInit {
  isSaving = false;
  ticketAttachment: ITicketAttachment | null = null;

  ticketsSharedCollection: ITicket[] = [];

  protected ticketAttachmentService = inject(TicketAttachmentService);
  protected ticketAttachmentFormService = inject(TicketAttachmentFormService);
  protected ticketService = inject(TicketService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TicketAttachmentFormGroup = this.ticketAttachmentFormService.createTicketAttachmentFormGroup();

  compareTicket = (o1: ITicket | null, o2: ITicket | null): boolean => this.ticketService.compareTicket(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ticketAttachment }) => {
      this.ticketAttachment = ticketAttachment;
      if (ticketAttachment) {
        this.updateForm(ticketAttachment);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ticketAttachment = this.ticketAttachmentFormService.getTicketAttachment(this.editForm);
    if (ticketAttachment.id !== null) {
      this.subscribeToSaveResponse(this.ticketAttachmentService.update(ticketAttachment));
    } else {
      this.subscribeToSaveResponse(this.ticketAttachmentService.create(ticketAttachment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicketAttachment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(ticketAttachment: ITicketAttachment): void {
    this.ticketAttachment = ticketAttachment;
    this.ticketAttachmentFormService.resetForm(this.editForm, ticketAttachment);

    this.ticketsSharedCollection = this.ticketService.addTicketToCollectionIfMissing<ITicket>(
      this.ticketsSharedCollection,
      ticketAttachment.ticket,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ticketService
      .query()
      .pipe(map((res: HttpResponse<ITicket[]>) => res.body ?? []))
      .pipe(map((tickets: ITicket[]) => this.ticketService.addTicketToCollectionIfMissing<ITicket>(tickets, this.ticketAttachment?.ticket)))
      .subscribe((tickets: ITicket[]) => (this.ticketsSharedCollection = tickets));
  }
}
