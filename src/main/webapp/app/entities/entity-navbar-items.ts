import NavbarItem from 'app/layouts/navbar/navbar-item.model';

export const EntityNavbarItems: NavbarItem[] = [
  {
    name: 'Ticket',
    route: '/ticket',
    translationKey: 'global.menu.entities.ticket',
  },
  {
    name: 'TicketStep',
    route: '/ticket-step',
    translationKey: 'global.menu.entities.ticketStep',
  },
  {
    name: 'TicketDataLink',
    route: '/ticket-data-link',
    translationKey: 'global.menu.entities.ticketDataLink',
  },
  {
    name: 'TicketRelation',
    route: '/ticket-relation',
    translationKey: 'global.menu.entities.ticketRelation',
  },
  {
    name: 'TicketAttachment',
    route: '/ticket-attachment',
    translationKey: 'global.menu.entities.ticketAttachment',
  },
  {
    name: 'TicketSLA',
    route: '/ticket-sla',
    translationKey: 'global.menu.entities.ticketSLA',
  },
  {
    name: 'TicketComment',
    route: '/ticket-comment',
    translationKey: 'global.menu.entities.ticketComment',
  },
];
