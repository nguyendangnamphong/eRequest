import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TicketAttachmentResolve from './route/ticket-attachment-routing-resolve.service';

const ticketAttachmentRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/ticket-attachment.component').then(m => m.TicketAttachmentComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/ticket-attachment-detail.component').then(m => m.TicketAttachmentDetailComponent),
    resolve: {
      ticketAttachment: TicketAttachmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/ticket-attachment-update.component').then(m => m.TicketAttachmentUpdateComponent),
    resolve: {
      ticketAttachment: TicketAttachmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/ticket-attachment-update.component').then(m => m.TicketAttachmentUpdateComponent),
    resolve: {
      ticketAttachment: TicketAttachmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ticketAttachmentRoute;
