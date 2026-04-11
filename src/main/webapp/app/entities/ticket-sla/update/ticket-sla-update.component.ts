import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITicket } from 'app/entities/ticket/ticket.model';
import { TicketService } from 'app/entities/ticket/service/ticket.service';
import { ITicketSLA } from '../ticket-sla.model';
import { TicketSLAService } from '../service/ticket-sla.service';
import { TicketSLAFormGroup, TicketSLAFormService } from './ticket-sla-form.service';

@Component({
  standalone: true,
  selector: 'jhi-ticket-sla-update',
  templateUrl: './ticket-sla-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TicketSLAUpdateComponent implements OnInit {
  isSaving = false;
  ticketSLA: ITicketSLA | null = null;

  ticketsSharedCollection: ITicket[] = [];

  protected ticketSLAService = inject(TicketSLAService);
  protected ticketSLAFormService = inject(TicketSLAFormService);
  protected ticketService = inject(TicketService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TicketSLAFormGroup = this.ticketSLAFormService.createTicketSLAFormGroup();

  compareTicket = (o1: ITicket | null, o2: ITicket | null): boolean => this.ticketService.compareTicket(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ticketSLA }) => {
      this.ticketSLA = ticketSLA;
      if (ticketSLA) {
        this.updateForm(ticketSLA);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ticketSLA = this.ticketSLAFormService.getTicketSLA(this.editForm);
    if (ticketSLA.id !== null) {
      this.subscribeToSaveResponse(this.ticketSLAService.update(ticketSLA));
    } else {
      this.subscribeToSaveResponse(this.ticketSLAService.create(ticketSLA));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicketSLA>>): void {
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

  protected updateForm(ticketSLA: ITicketSLA): void {
    this.ticketSLA = ticketSLA;
    this.ticketSLAFormService.resetForm(this.editForm, ticketSLA);

    this.ticketsSharedCollection = this.ticketService.addTicketToCollectionIfMissing<ITicket>(
      this.ticketsSharedCollection,
      ticketSLA.ticket,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ticketService
      .query()
      .pipe(map((res: HttpResponse<ITicket[]>) => res.body ?? []))
      .pipe(map((tickets: ITicket[]) => this.ticketService.addTicketToCollectionIfMissing<ITicket>(tickets, this.ticketSLA?.ticket)))
      .subscribe((tickets: ITicket[]) => (this.ticketsSharedCollection = tickets));
  }
}
