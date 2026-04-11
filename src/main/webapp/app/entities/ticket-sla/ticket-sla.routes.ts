import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TicketSLAResolve from './route/ticket-sla-routing-resolve.service';

const ticketSLARoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/ticket-sla.component').then(m => m.TicketSLAComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/ticket-sla-detail.component').then(m => m.TicketSLADetailComponent),
    resolve: {
      ticketSLA: TicketSLAResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/ticket-sla-update.component').then(m => m.TicketSLAUpdateComponent),
    resolve: {
      ticketSLA: TicketSLAResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/ticket-sla-update.component').then(m => m.TicketSLAUpdateComponent),
    resolve: {
      ticketSLA: TicketSLAResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ticketSLARoute;
