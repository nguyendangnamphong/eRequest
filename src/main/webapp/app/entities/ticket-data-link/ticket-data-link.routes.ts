import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TicketDataLinkResolve from './route/ticket-data-link-routing-resolve.service';

const ticketDataLinkRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/ticket-data-link.component').then(m => m.TicketDataLinkComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/ticket-data-link-detail.component').then(m => m.TicketDataLinkDetailComponent),
    resolve: {
      ticketDataLink: TicketDataLinkResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/ticket-data-link-update.component').then(m => m.TicketDataLinkUpdateComponent),
    resolve: {
      ticketDataLink: TicketDataLinkResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/ticket-data-link-update.component').then(m => m.TicketDataLinkUpdateComponent),
    resolve: {
      ticketDataLink: TicketDataLinkResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ticketDataLinkRoute;
