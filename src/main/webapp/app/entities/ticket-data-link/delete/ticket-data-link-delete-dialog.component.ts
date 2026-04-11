import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITicketDataLink } from '../ticket-data-link.model';
import { TicketDataLinkService } from '../service/ticket-data-link.service';

@Component({
  standalone: true,
  templateUrl: './ticket-data-link-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TicketDataLinkDeleteDialogComponent {
  ticketDataLink?: ITicketDataLink;

  protected ticketDataLinkService = inject(TicketDataLinkService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ticketDataLinkService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
