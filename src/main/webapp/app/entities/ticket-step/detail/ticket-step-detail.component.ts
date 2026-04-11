import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ITicketStep } from '../ticket-step.model';

@Component({
  standalone: true,
  selector: 'jhi-ticket-step-detail',
  templateUrl: './ticket-step-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TicketStepDetailComponent {
  ticketStep = input<ITicketStep | null>(null);

  previousState(): void {
    window.history.back();
  }
}
