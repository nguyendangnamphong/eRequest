import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITicket } from 'app/entities/ticket/ticket.model';
import { TicketService } from 'app/entities/ticket/service/ticket.service';
import { ITicketRelation } from '../ticket-relation.model';
import { TicketRelationService } from '../service/ticket-relation.service';
import { TicketRelationFormGroup, TicketRelationFormService } from './ticket-relation-form.service';

@Component({
  standalone: true,
  selector: 'jhi-ticket-relation-update',
  templateUrl: './ticket-relation-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TicketRelationUpdateComponent implements OnInit {
  isSaving = false;
  ticketRelation: ITicketRelation | null = null;

  ticketsSharedCollection: ITicket[] = [];

  protected ticketRelationService = inject(TicketRelationService);
  protected ticketRelationFormService = inject(TicketRelationFormService);
  protected ticketService = inject(TicketService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TicketRelationFormGroup = this.ticketRelationFormService.createTicketRelationFormGroup();

  compareTicket = (o1: ITicket | null, o2: ITicket | null): boolean => this.ticketService.compareTicket(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ticketRelation }) => {
      this.ticketRelation = ticketRelation;
      if (ticketRelation) {
        this.updateForm(ticketRelation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ticketRelation = this.ticketRelationFormService.getTicketRelation(this.editForm);
    if (ticketRelation.id !== null) {
      this.subscribeToSaveResponse(this.ticketRelationService.update(ticketRelation));
    } else {
      this.subscribeToSaveResponse(this.ticketRelationService.create(ticketRelation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicketRelation>>): void {
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

  protected updateForm(ticketRelation: ITicketRelation): void {
    this.ticketRelation = ticketRelation;
    this.ticketRelationFormService.resetForm(this.editForm, ticketRelation);

    this.ticketsSharedCollection = this.ticketService.addTicketToCollectionIfMissing<ITicket>(
      this.ticketsSharedCollection,
      ticketRelation.ticket,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ticketService
      .query()
      .pipe(map((res: HttpResponse<ITicket[]>) => res.body ?? []))
      .pipe(map((tickets: ITicket[]) => this.ticketService.addTicketToCollectionIfMissing<ITicket>(tickets, this.ticketRelation?.ticket)))
      .subscribe((tickets: ITicket[]) => (this.ticketsSharedCollection = tickets));
  }
}
