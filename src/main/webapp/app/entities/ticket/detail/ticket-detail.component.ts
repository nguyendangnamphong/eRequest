import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ITicket } from '../ticket.model';

@Component({
  standalone: true,
  selector: 'jhi-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TicketDetailComponent {
  ticket = input<ITicket | null>(null);

  previousState(): void {
    window.history.back();
  }
}
