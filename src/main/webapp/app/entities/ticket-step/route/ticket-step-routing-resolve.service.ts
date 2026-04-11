import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITicketStep } from '../ticket-step.model';
import { TicketStepService } from '../service/ticket-step.service';

const ticketStepResolve = (route: ActivatedRouteSnapshot): Observable<null | ITicketStep> => {
  const id = route.params.id;
  if (id) {
    return inject(TicketStepService)
      .find(id)
      .pipe(
        mergeMap((ticketStep: HttpResponse<ITicketStep>) => {
          if (ticketStep.body) {
            return of(ticketStep.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default ticketStepResolve;
