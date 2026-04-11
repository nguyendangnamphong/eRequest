import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITicketAttachment } from '../ticket-attachment.model';
import { TicketAttachmentService } from '../service/ticket-attachment.service';

const ticketAttachmentResolve = (route: ActivatedRouteSnapshot): Observable<null | ITicketAttachment> => {
  const id = route.params.id;
  if (id) {
    return inject(TicketAttachmentService)
      .find(id)
      .pipe(
        mergeMap((ticketAttachment: HttpResponse<ITicketAttachment>) => {
          if (ticketAttachment.body) {
            return of(ticketAttachment.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default ticketAttachmentResolve;
