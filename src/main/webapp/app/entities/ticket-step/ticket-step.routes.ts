import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TicketStepResolve from './route/ticket-step-routing-resolve.service';

const ticketStepRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/ticket-step.component').then(m => m.TicketStepComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/ticket-step-detail.component').then(m => m.TicketStepDetailComponent),
    resolve: {
      ticketStep: TicketStepResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/ticket-step-update.component').then(m => m.TicketStepUpdateComponent),
    resolve: {
      ticketStep: TicketStepResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/ticket-step-update.component').then(m => m.TicketStepUpdateComponent),
    resolve: {
      ticketStep: TicketStepResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ticketStepRoute;
