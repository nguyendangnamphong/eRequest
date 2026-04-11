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

describe('TicketRelation e2e test', () => {
  const ticketRelationPageUrl = '/ticket-relation';
  const ticketRelationPageUrlPattern = new RegExp('/ticket-relation(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const ticketRelationSample = { relatedTicketId: 9523 };

  let ticketRelation;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/ticket-relations+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/ticket-relations').as('postEntityRequest');
    cy.intercept('DELETE', '/api/ticket-relations/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (ticketRelation) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/ticket-relations/${ticketRelation.id}`,
      }).then(() => {
        ticketRelation = undefined;
      });
    }
  });

  it('TicketRelations menu should load TicketRelations page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ticket-relation');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TicketRelation').should('exist');
    cy.url().should('match', ticketRelationPageUrlPattern);
  });

  describe('TicketRelation page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(ticketRelationPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TicketRelation page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/ticket-relation/new$'));
        cy.getEntityCreateUpdateHeading('TicketRelation');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketRelationPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/ticket-relations',
          body: ticketRelationSample,
        }).then(({ body }) => {
          ticketRelation = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/ticket-relations+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [ticketRelation],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(ticketRelationPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TicketRelation page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('ticketRelation');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketRelationPageUrlPattern);
      });

      it('edit button click should load edit TicketRelation page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TicketRelation');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketRelationPageUrlPattern);
      });

      it('edit button click should load edit TicketRelation page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TicketRelation');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketRelationPageUrlPattern);
      });

      it('last delete button click should delete instance of TicketRelation', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('ticketRelation').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketRelationPageUrlPattern);

        ticketRelation = undefined;
      });
    });
  });

  describe('new TicketRelation page', () => {
    beforeEach(() => {
      cy.visit(`${ticketRelationPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TicketRelation');
    });

    it('should create an instance of TicketRelation', () => {
      cy.get(`[data-cy="relatedTicketId"]`).type('19873');
      cy.get(`[data-cy="relatedTicketId"]`).should('have.value', '19873');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        ticketRelation = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', ticketRelationPageUrlPattern);
    });
  });
});
