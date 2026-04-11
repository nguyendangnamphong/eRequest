import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ITicket } from 'app/entities/ticket/ticket.model';
import { TicketService } from 'app/entities/ticket/service/ticket.service';
import { TicketCommentService } from '../service/ticket-comment.service';
import { ITicketComment } from '../ticket-comment.model';
import { TicketCommentFormGroup, TicketCommentFormService } from './ticket-comment-form.service';

@Component({
  standalone: true,
  selector: 'jhi-ticket-comment-update',
  templateUrl: './ticket-comment-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TicketCommentUpdateComponent implements OnInit {
  isSaving = false;
  ticketComment: ITicketComment | null = null;

  ticketsSharedCollection: ITicket[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected ticketCommentService = inject(TicketCommentService);
  protected ticketCommentFormService = inject(TicketCommentFormService);
  protected ticketService = inject(TicketService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TicketCommentFormGroup = this.ticketCommentFormService.createTicketCommentFormGroup();

  compareTicket = (o1: ITicket | null, o2: ITicket | null): boolean => this.ticketService.compareTicket(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ticketComment }) => {
      this.ticketComment = ticketComment;
      if (ticketComment) {
        this.updateForm(ticketComment);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('eRequestApp.error', { ...err, key: `error.file.${err.key}` })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ticketComment = this.ticketCommentFormService.getTicketComment(this.editForm);
    if (ticketComment.id !== null) {
      this.subscribeToSaveResponse(this.ticketCommentService.update(ticketComment));
    } else {
      this.subscribeToSaveResponse(this.ticketCommentService.create(ticketComment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicketComment>>): void {
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

  protected updateForm(ticketComment: ITicketComment): void {
    this.ticketComment = ticketComment;
    this.ticketCommentFormService.resetForm(this.editForm, ticketComment);

    this.ticketsSharedCollection = this.ticketService.addTicketToCollectionIfMissing<ITicket>(
      this.ticketsSharedCollection,
      ticketComment.ticket,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ticketService
      .query()
      .pipe(map((res: HttpResponse<ITicket[]>) => res.body ?? []))
      .pipe(map((tickets: ITicket[]) => this.ticketService.addTicketToCollectionIfMissing<ITicket>(tickets, this.ticketComment?.ticket)))
      .subscribe((tickets: ITicket[]) => (this.ticketsSharedCollection = tickets));
  }
}
