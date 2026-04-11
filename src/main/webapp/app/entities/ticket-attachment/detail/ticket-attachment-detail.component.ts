import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ITicketAttachment } from '../ticket-attachment.model';

@Component({
  standalone: true,
  selector: 'jhi-ticket-attachment-detail',
  templateUrl: './ticket-attachment-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TicketAttachmentDetailComponent {
  ticketAttachment = input<ITicketAttachment | null>(null);

  previousState(): void {
    window.history.back();
  }
}
