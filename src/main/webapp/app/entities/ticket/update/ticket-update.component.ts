import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITicket } from '../ticket.model';
import { TicketService } from '../service/ticket.service';
import { TicketFormGroup, TicketFormService } from './ticket-form.service';

@Component({
  standalone: true,
  selector: 'jhi-ticket-update',
  templateUrl: './ticket-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TicketUpdateComponent implements OnInit {
  isSaving = false;
  ticket: ITicket | null = null;

  protected ticketService = inject(TicketService);
  protected ticketFormService = inject(TicketFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TicketFormGroup = this.ticketFormService.createTicketFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ticket }) => {
      this.ticket = ticket;
      if (ticket) {
        this.updateForm(ticket);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ticket = this.ticketFormService.getTicket(this.editForm);
    if (ticket.id !== null) {
      this.subscribeToSaveResponse(this.ticketService.update(ticket));
    } else {
      this.subscribeToSaveResponse(this.ticketService.create(ticket));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicket>>): void {
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

  protected updateForm(ticket: ITicket): void {
    this.ticket = ticket;
    this.ticketFormService.resetForm(this.editForm, ticket);
  }
}
