import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITicketSLA } from '../ticket-sla.model';
import { TicketSLAService } from '../service/ticket-sla.service';

const ticketSLAResolve = (route: ActivatedRouteSnapshot): Observable<null | ITicketSLA> => {
  const id = route.params.id;
  if (id) {
    return inject(TicketSLAService)
      .find(id)
      .pipe(
        mergeMap((ticketSLA: HttpResponse<ITicketSLA>) => {
          if (ticketSLA.body) {
            return of(ticketSLA.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default ticketSLAResolve;
