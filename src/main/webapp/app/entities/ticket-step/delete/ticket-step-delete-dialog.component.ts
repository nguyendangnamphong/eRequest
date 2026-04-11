import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITicketStep } from '../ticket-step.model';
import { TicketStepService } from '../service/ticket-step.service';

@Component({
  standalone: true,
  templateUrl: './ticket-step-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TicketStepDeleteDialogComponent {
  ticketStep?: ITicketStep;

  protected ticketStepService = inject(TicketStepService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ticketStepService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
