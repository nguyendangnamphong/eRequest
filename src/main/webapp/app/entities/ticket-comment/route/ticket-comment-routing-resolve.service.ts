import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITicketComment } from '../ticket-comment.model';
import { TicketCommentService } from '../service/ticket-comment.service';

const ticketCommentResolve = (route: ActivatedRouteSnapshot): Observable<null | ITicketComment> => {
  const id = route.params.id;
  if (id) {
    return inject(TicketCommentService)
      .find(id)
      .pipe(
        mergeMap((ticketComment: HttpResponse<ITicketComment>) => {
          if (ticketComment.body) {
            return of(ticketComment.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default ticketCommentResolve;
