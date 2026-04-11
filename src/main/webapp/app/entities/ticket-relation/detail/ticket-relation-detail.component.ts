import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ITicketRelation } from '../ticket-relation.model';

@Component({
  standalone: true,
  selector: 'jhi-ticket-relation-detail',
  templateUrl: './ticket-relation-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TicketRelationDetailComponent {
  ticketRelation = input<ITicketRelation | null>(null);

  previousState(): void {
    window.history.back();
  }
}
