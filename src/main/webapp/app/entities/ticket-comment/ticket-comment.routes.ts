import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TicketCommentResolve from './route/ticket-comment-routing-resolve.service';

const ticketCommentRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/ticket-comment.component').then(m => m.TicketCommentComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/ticket-comment-detail.component').then(m => m.TicketCommentDetailComponent),
    resolve: {
      ticketComment: TicketCommentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/ticket-comment-update.component').then(m => m.TicketCommentUpdateComponent),
    resolve: {
      ticketComment: TicketCommentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/ticket-comment-update.component').then(m => m.TicketCommentUpdateComponent),
    resolve: {
      ticketComment: TicketCommentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ticketCommentRoute;
