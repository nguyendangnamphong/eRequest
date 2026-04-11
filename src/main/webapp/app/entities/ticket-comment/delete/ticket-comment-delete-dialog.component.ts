import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITicketComment } from '../ticket-comment.model';
import { TicketCommentService } from '../service/ticket-comment.service';

@Component({
  standalone: true,
  templateUrl: './ticket-comment-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TicketCommentDeleteDialogComponent {
  ticketComment?: ITicketComment;

  protected ticketCommentService = inject(TicketCommentService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ticketCommentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
