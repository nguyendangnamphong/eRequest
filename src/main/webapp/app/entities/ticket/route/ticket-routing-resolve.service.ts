import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITicket } from '../ticket.model';
import { TicketService } from '../service/ticket.service';

const ticketResolve = (route: ActivatedRouteSnapshot): Observable<null | ITicket> => {
  const id = route.params.id;
  if (id) {
    return inject(TicketService)
      .find(id)
      .pipe(
        mergeMap((ticket: HttpResponse<ITicket>) => {
          if (ticket.body) {
            return of(ticket.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default ticketResolve;
