import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITicket } from '../ticket.model';
import { TicketService } from '../service/ticket.service';

@Component({
  standalone: true,
  templateUrl: './ticket-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TicketDeleteDialogComponent {
  ticket?: ITicket;

  protected ticketService = inject(TicketService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ticketService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
