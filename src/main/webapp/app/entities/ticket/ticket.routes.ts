import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TicketResolve from './route/ticket-routing-resolve.service';

const ticketRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/ticket.component').then(m => m.TicketComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/ticket-detail.component').then(m => m.TicketDetailComponent),
    resolve: {
      ticket: TicketResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/ticket-update.component').then(m => m.TicketUpdateComponent),
    resolve: {
      ticket: TicketResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/ticket-update.component').then(m => m.TicketUpdateComponent),
    resolve: {
      ticket: TicketResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ticketRoute;
