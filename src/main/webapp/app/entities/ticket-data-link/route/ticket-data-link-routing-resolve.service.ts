import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITicketDataLink } from '../ticket-data-link.model';
import { TicketDataLinkService } from '../service/ticket-data-link.service';

const ticketDataLinkResolve = (route: ActivatedRouteSnapshot): Observable<null | ITicketDataLink> => {
  const id = route.params.id;
  if (id) {
    return inject(TicketDataLinkService)
      .find(id)
      .pipe(
        mergeMap((ticketDataLink: HttpResponse<ITicketDataLink>) => {
          if (ticketDataLink.body) {
            return of(ticketDataLink.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default ticketDataLinkResolve;
