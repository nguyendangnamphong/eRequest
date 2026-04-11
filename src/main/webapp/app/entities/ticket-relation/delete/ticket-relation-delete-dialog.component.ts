import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITicketRelation } from '../ticket-relation.model';
import { TicketRelationService } from '../service/ticket-relation.service';

@Component({
  standalone: true,
  templateUrl: './ticket-relation-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TicketRelationDeleteDialogComponent {
  ticketRelation?: ITicketRelation;

  protected ticketRelationService = inject(TicketRelationService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ticketRelationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
