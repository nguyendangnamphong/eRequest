import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ITicketSLA } from '../ticket-sla.model';

@Component({
  standalone: true,
  selector: 'jhi-ticket-sla-detail',
  templateUrl: './ticket-sla-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TicketSLADetailComponent {
  ticketSLA = input<ITicketSLA | null>(null);

  previousState(): void {
    window.history.back();
  }
}
