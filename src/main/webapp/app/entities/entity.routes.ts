import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'eRequestApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'ticket',
    data: { pageTitle: 'eRequestApp.ticket.home.title' },
    loadChildren: () => import('./ticket/ticket.routes'),
  },
  {
    path: 'ticket-step',
    data: { pageTitle: 'eRequestApp.ticketStep.home.title' },
    loadChildren: () => import('./ticket-step/ticket-step.routes'),
  },
  {
    path: 'ticket-data-link',
    data: { pageTitle: 'eRequestApp.ticketDataLink.home.title' },
    loadChildren: () => import('./ticket-data-link/ticket-data-link.routes'),
  },
  {
    path: 'ticket-relation',
    data: { pageTitle: 'eRequestApp.ticketRelation.home.title' },
    loadChildren: () => import('./ticket-relation/ticket-relation.routes'),
  },
  {
    path: 'ticket-attachment',
    data: { pageTitle: 'eRequestApp.ticketAttachment.home.title' },
    loadChildren: () => import('./ticket-attachment/ticket-attachment.routes'),
  },
  {
    path: 'ticket-sla',
    data: { pageTitle: 'eRequestApp.ticketSLA.home.title' },
    loadChildren: () => import('./ticket-sla/ticket-sla.routes'),
  },
  {
    path: 'ticket-comment',
    data: { pageTitle: 'eRequestApp.ticketComment.home.title' },
    loadChildren: () => import('./ticket-comment/ticket-comment.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
