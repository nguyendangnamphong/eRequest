import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITicketSLA } from '../ticket-sla.model';
import { TicketSLAService } from '../service/ticket-sla.service';

@Component({
  standalone: true,
  templateUrl: './ticket-sla-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TicketSLADeleteDialogComponent {
  ticketSLA?: ITicketSLA;

  protected ticketSLAService = inject(TicketSLAService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ticketSLAService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
