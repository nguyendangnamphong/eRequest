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

describe('Ticket e2e test', () => {
  const ticketPageUrl = '/ticket';
  const ticketPageUrlPattern = new RegExp('/ticket(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const ticketSample = {
    flowId: 25621,
    ticketName: 'calmly regarding',
    creatorEmail: 'certainly refer drat',
    status: 32690,
    version: 20089,
  };

  let ticket;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/tickets+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/tickets').as('postEntityRequest');
    cy.intercept('DELETE', '/api/tickets/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (ticket) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/tickets/${ticket.id}`,
      }).then(() => {
        ticket = undefined;
      });
    }
  });

  it('Tickets menu should load Tickets page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ticket');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Ticket').should('exist');
    cy.url().should('match', ticketPageUrlPattern);
  });

  describe('Ticket page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(ticketPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Ticket page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/ticket/new$'));
        cy.getEntityCreateUpdateHeading('Ticket');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/tickets',
          body: ticketSample,
        }).then(({ body }) => {
          ticket = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/tickets+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/tickets?page=0&size=20>; rel="last",<http://localhost/api/tickets?page=0&size=20>; rel="first"',
              },
              body: [ticket],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(ticketPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Ticket page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('ticket');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketPageUrlPattern);
      });

      it('edit button click should load edit Ticket page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Ticket');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketPageUrlPattern);
      });

      it('edit button click should load edit Ticket page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Ticket');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketPageUrlPattern);
      });

      it('last delete button click should delete instance of Ticket', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('ticket').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketPageUrlPattern);

        ticket = undefined;
      });
    });
  });

  describe('new Ticket page', () => {
    beforeEach(() => {
      cy.visit(`${ticketPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Ticket');
    });

    it('should create an instance of Ticket', () => {
      cy.get(`[data-cy="flowId"]`).type('20048');
      cy.get(`[data-cy="flowId"]`).should('have.value', '20048');

      cy.get(`[data-cy="ticketName"]`).type('finally masterpiece');
      cy.get(`[data-cy="ticketName"]`).should('have.value', 'finally masterpiece');

      cy.get(`[data-cy="creatorEmail"]`).type('justly');
      cy.get(`[data-cy="creatorEmail"]`).should('have.value', 'justly');

      cy.get(`[data-cy="currentStepId"]`).type('9748');
      cy.get(`[data-cy="currentStepId"]`).should('have.value', '9748');

      cy.get(`[data-cy="status"]`).type('5432');
      cy.get(`[data-cy="status"]`).should('have.value', '5432');

      cy.get(`[data-cy="priority"]`).type('5030');
      cy.get(`[data-cy="priority"]`).should('have.value', '5030');

      cy.get(`[data-cy="version"]`).type('10585');
      cy.get(`[data-cy="version"]`).should('have.value', '10585');

      cy.get(`[data-cy="createdAt"]`).type('2026-04-10T19:39');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-04-10T19:39');

      cy.get(`[data-cy="updatedAt"]`).type('2026-04-10T09:10');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2026-04-10T09:10');

      cy.get(`[data-cy="completedAt"]`).type('2026-04-11T01:12');
      cy.get(`[data-cy="completedAt"]`).blur();
      cy.get(`[data-cy="completedAt"]`).should('have.value', '2026-04-11T01:12');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        ticket = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', ticketPageUrlPattern);
    });
  });
});
