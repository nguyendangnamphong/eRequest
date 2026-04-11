import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITicket } from 'app/entities/ticket/ticket.model';
import { TicketService } from 'app/entities/ticket/service/ticket.service';
import { ITicketDataLink } from '../ticket-data-link.model';
import { TicketDataLinkService } from '../service/ticket-data-link.service';
import { TicketDataLinkFormGroup, TicketDataLinkFormService } from './ticket-data-link-form.service';

@Component({
  standalone: true,
  selector: 'jhi-ticket-data-link-update',
  templateUrl: './ticket-data-link-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TicketDataLinkUpdateComponent implements OnInit {
  isSaving = false;
  ticketDataLink: ITicketDataLink | null = null;

  ticketsSharedCollection: ITicket[] = [];

  protected ticketDataLinkService = inject(TicketDataLinkService);
  protected ticketDataLinkFormService = inject(TicketDataLinkFormService);
  protected ticketService = inject(TicketService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TicketDataLinkFormGroup = this.ticketDataLinkFormService.createTicketDataLinkFormGroup();

  compareTicket = (o1: ITicket | null, o2: ITicket | null): boolean => this.ticketService.compareTicket(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ticketDataLink }) => {
      this.ticketDataLink = ticketDataLink;
      if (ticketDataLink) {
        this.updateForm(ticketDataLink);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ticketDataLink = this.ticketDataLinkFormService.getTicketDataLink(this.editForm);
    if (ticketDataLink.id !== null) {
      this.subscribeToSaveResponse(this.ticketDataLinkService.update(ticketDataLink));
    } else {
      this.subscribeToSaveResponse(this.ticketDataLinkService.create(ticketDataLink));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicketDataLink>>): void {
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

  protected updateForm(ticketDataLink: ITicketDataLink): void {
    this.ticketDataLink = ticketDataLink;
    this.ticketDataLinkFormService.resetForm(this.editForm, ticketDataLink);

    this.ticketsSharedCollection = this.ticketService.addTicketToCollectionIfMissing<ITicket>(
      this.ticketsSharedCollection,
      ticketDataLink.ticket,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ticketService
      .query()
      .pipe(map((res: HttpResponse<ITicket[]>) => res.body ?? []))
      .pipe(map((tickets: ITicket[]) => this.ticketService.addTicketToCollectionIfMissing<ITicket>(tickets, this.ticketDataLink?.ticket)))
      .subscribe((tickets: ITicket[]) => (this.ticketsSharedCollection = tickets));
  }
}
