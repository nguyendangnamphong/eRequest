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

describe('TicketStep e2e test', () => {
  const ticketStepPageUrl = '/ticket-step';
  const ticketStepPageUrlPattern = new RegExp('/ticket-step(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const ticketStepSample = { nodeId: 13502, performerEmail: 'mob salty', status: 2322 };

  let ticketStep;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/ticket-steps+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/ticket-steps').as('postEntityRequest');
    cy.intercept('DELETE', '/api/ticket-steps/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (ticketStep) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/ticket-steps/${ticketStep.id}`,
      }).then(() => {
        ticketStep = undefined;
      });
    }
  });

  it('TicketSteps menu should load TicketSteps page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ticket-step');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TicketStep').should('exist');
    cy.url().should('match', ticketStepPageUrlPattern);
  });

  describe('TicketStep page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(ticketStepPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TicketStep page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/ticket-step/new$'));
        cy.getEntityCreateUpdateHeading('TicketStep');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketStepPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/ticket-steps',
          body: ticketStepSample,
        }).then(({ body }) => {
          ticketStep = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/ticket-steps+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [ticketStep],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(ticketStepPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TicketStep page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('ticketStep');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketStepPageUrlPattern);
      });

      it('edit button click should load edit TicketStep page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TicketStep');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketStepPageUrlPattern);
      });

      it('edit button click should load edit TicketStep page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TicketStep');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketStepPageUrlPattern);
      });

      it('last delete button click should delete instance of TicketStep', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('ticketStep').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketStepPageUrlPattern);

        ticketStep = undefined;
      });
    });
  });

  describe('new TicketStep page', () => {
    beforeEach(() => {
      cy.visit(`${ticketStepPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TicketStep');
    });

    it('should create an instance of TicketStep', () => {
      cy.get(`[data-cy="nodeId"]`).type('14294');
      cy.get(`[data-cy="nodeId"]`).should('have.value', '14294');

      cy.get(`[data-cy="performerEmail"]`).type('edge');
      cy.get(`[data-cy="performerEmail"]`).should('have.value', 'edge');

      cy.get(`[data-cy="status"]`).type('31898');
      cy.get(`[data-cy="status"]`).should('have.value', '31898');

      cy.get(`[data-cy="startedAt"]`).type('2026-04-10T07:12');
      cy.get(`[data-cy="startedAt"]`).blur();
      cy.get(`[data-cy="startedAt"]`).should('have.value', '2026-04-10T07:12');

      cy.get(`[data-cy="finishedAt"]`).type('2026-04-11T05:00');
      cy.get(`[data-cy="finishedAt"]`).blur();
      cy.get(`[data-cy="finishedAt"]`).should('have.value', '2026-04-11T05:00');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        ticketStep = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', ticketStepPageUrlPattern);
    });
  });
});
