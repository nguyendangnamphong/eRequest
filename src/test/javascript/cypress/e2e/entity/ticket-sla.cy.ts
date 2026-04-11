import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('TicketSLA e2e test', () => {
  const ticketSLAPageUrl = '/ticket-sla';
  const ticketSLAPageUrlPattern = new RegExp('/ticket-sla(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const ticketSLASample = { deadline: '2026-04-10T18:12:19.117Z' };

  let ticketSLA;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/ticket-slas+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/ticket-slas').as('postEntityRequest');
    cy.intercept('DELETE', '/api/ticket-slas/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (ticketSLA) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/ticket-slas/${ticketSLA.id}`,
      }).then(() => {
        ticketSLA = undefined;
      });
    }
  });

  it('TicketSLAS menu should load TicketSLAS page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ticket-sla');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TicketSLA').should('exist');
    cy.url().should('match', ticketSLAPageUrlPattern);
  });

  describe('TicketSLA page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(ticketSLAPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TicketSLA page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/ticket-sla/new$'));
        cy.getEntityCreateUpdateHeading('TicketSLA');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketSLAPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/ticket-slas',
          body: ticketSLASample,
        }).then(({ body }) => {
          ticketSLA = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/ticket-slas+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [ticketSLA],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(ticketSLAPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TicketSLA page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('ticketSLA');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketSLAPageUrlPattern);
      });

      it('edit button click should load edit TicketSLA page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TicketSLA');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketSLAPageUrlPattern);
      });

      it('edit button click should load edit TicketSLA page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TicketSLA');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketSLAPageUrlPattern);
      });

      it('last delete button click should delete instance of TicketSLA', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('ticketSLA').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketSLAPageUrlPattern);

        ticketSLA = undefined;
      });
    });
  });

  describe('new TicketSLA page', () => {
    beforeEach(() => {
      cy.visit(`${ticketSLAPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TicketSLA');
    });

    it('should create an instance of TicketSLA', () => {
      cy.get(`[data-cy="deadline"]`).type('2026-04-10T17:51');
      cy.get(`[data-cy="deadline"]`).blur();
      cy.get(`[data-cy="deadline"]`).should('have.value', '2026-04-10T17:51');

      cy.get(`[data-cy="remindAt"]`).type('2026-04-10T21:09');
      cy.get(`[data-cy="remindAt"]`).blur();
      cy.get(`[data-cy="remindAt"]`).should('have.value', '2026-04-10T21:09');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        ticketSLA = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', ticketSLAPageUrlPattern);
    });
  });
});
