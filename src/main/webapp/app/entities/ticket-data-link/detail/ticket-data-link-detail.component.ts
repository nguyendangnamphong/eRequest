import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ITicketDataLink } from '../ticket-data-link.model';

@Component({
  standalone: true,
  selector: 'jhi-ticket-data-link-detail',
  templateUrl: './ticket-data-link-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TicketDataLinkDetailComponent {
  ticketDataLink = input<ITicketDataLink | null>(null);

  previousState(): void {
    window.history.back();
  }
}
