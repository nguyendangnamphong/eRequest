import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITicketSLA } from 'app/entities/ticket-sla/ticket-sla.model';
import { TicketSLAService } from 'app/entities/ticket-sla/service/ticket-sla.service';
import { ITicket } from 'app/entities/ticket/ticket.model';
import { TicketService } from 'app/entities/ticket/service/ticket.service';
import { TicketStepService } from '../service/ticket-step.service';
import { ITicketStep } from '../ticket-step.model';
import { TicketStepFormGroup, TicketStepFormService } from './ticket-step-form.service';

@Component({
  standalone: true,
  selector: 'jhi-ticket-step-update',
  templateUrl: './ticket-step-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TicketStepUpdateComponent implements OnInit {
  isSaving = false;
  ticketStep: ITicketStep | null = null;

  slasCollection: ITicketSLA[] = [];
  ticketsSharedCollection: ITicket[] = [];

  protected ticketStepService = inject(TicketStepService);
  protected ticketStepFormService = inject(TicketStepFormService);
  protected ticketSLAService = inject(TicketSLAService);
  protected ticketService = inject(TicketService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TicketStepFormGroup = this.ticketStepFormService.createTicketStepFormGroup();

  compareTicketSLA = (o1: ITicketSLA | null, o2: ITicketSLA | null): boolean => this.ticketSLAService.compareTicketSLA(o1, o2);

  compareTicket = (o1: ITicket | null, o2: ITicket | null): boolean => this.ticketService.compareTicket(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ticketStep }) => {
      this.ticketStep = ticketStep;
      if (ticketStep) {
        this.updateForm(ticketStep);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ticketStep = this.ticketStepFormService.getTicketStep(this.editForm);
    if (ticketStep.id !== null) {
      this.subscribeToSaveResponse(this.ticketStepService.update(ticketStep));
    } else {
      this.subscribeToSaveResponse(this.ticketStepService.create(ticketStep));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicketStep>>): void {
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

  protected updateForm(ticketStep: ITicketStep): void {
    this.ticketStep = ticketStep;
    this.ticketStepFormService.resetForm(this.editForm, ticketStep);

    this.slasCollection = this.ticketSLAService.addTicketSLAToCollectionIfMissing<ITicketSLA>(this.slasCollection, ticketStep.sla);
    this.ticketsSharedCollection = this.ticketService.addTicketToCollectionIfMissing<ITicket>(
      this.ticketsSharedCollection,
      ticketStep.ticket,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ticketSLAService
      .query({ filter: 'step-is-null' })
      .pipe(map((res: HttpResponse<ITicketSLA[]>) => res.body ?? []))
      .pipe(
        map((ticketSLAS: ITicketSLA[]) =>
          this.ticketSLAService.addTicketSLAToCollectionIfMissing<ITicketSLA>(ticketSLAS, this.ticketStep?.sla),
        ),
      )
      .subscribe((ticketSLAS: ITicketSLA[]) => (this.slasCollection = ticketSLAS));

    this.ticketService
      .query()
      .pipe(map((res: HttpResponse<ITicket[]>) => res.body ?? []))
      .pipe(map((tickets: ITicket[]) => this.ticketService.addTicketToCollectionIfMissing<ITicket>(tickets, this.ticketStep?.ticket)))
      .subscribe((tickets: ITicket[]) => (this.ticketsSharedCollection = tickets));
  }
}
