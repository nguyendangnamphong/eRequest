import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITicketAttachment } from '../ticket-attachment.model';
import { TicketAttachmentService } from '../service/ticket-attachment.service';

@Component({
  standalone: true,
  templateUrl: './ticket-attachment-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TicketAttachmentDeleteDialogComponent {
  ticketAttachment?: ITicketAttachment;

  protected ticketAttachmentService = inject(TicketAttachmentService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ticketAttachmentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
