import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITicketRelation } from '../ticket-relation.model';
import { TicketRelationService } from '../service/ticket-relation.service';

const ticketRelationResolve = (route: ActivatedRouteSnapshot): Observable<null | ITicketRelation> => {
  const id = route.params.id;
  if (id) {
    return inject(TicketRelationService)
      .find(id)
      .pipe(
        mergeMap((ticketRelation: HttpResponse<ITicketRelation>) => {
          if (ticketRelation.body) {
            return of(ticketRelation.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default ticketRelationResolve;
