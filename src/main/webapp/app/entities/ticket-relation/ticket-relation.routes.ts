import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TicketRelationResolve from './route/ticket-relation-routing-resolve.service';

const ticketRelationRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/ticket-relation.component').then(m => m.TicketRelationComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/ticket-relation-detail.component').then(m => m.TicketRelationDetailComponent),
    resolve: {
      ticketRelation: TicketRelationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/ticket-relation-update.component').then(m => m.TicketRelationUpdateComponent),
    resolve: {
      ticketRelation: TicketRelationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/ticket-relation-update.component').then(m => m.TicketRelationUpdateComponent),
    resolve: {
      ticketRelation: TicketRelationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ticketRelationRoute;
