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

describe('TicketDataLink e2e test', () => {
  const ticketDataLinkPageUrl = '/ticket-data-link';
  const ticketDataLinkPageUrlPattern = new RegExp('/ticket-data-link(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const ticketDataLinkSample = { nodeId: 19632, formDataId: 'mmm standard' };

  let ticketDataLink;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/ticket-data-links+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/ticket-data-links').as('postEntityRequest');
    cy.intercept('DELETE', '/api/ticket-data-links/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (ticketDataLink) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/ticket-data-links/${ticketDataLink.id}`,
      }).then(() => {
        ticketDataLink = undefined;
      });
    }
  });

  it('TicketDataLinks menu should load TicketDataLinks page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ticket-data-link');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TicketDataLink').should('exist');
    cy.url().should('match', ticketDataLinkPageUrlPattern);
  });

  describe('TicketDataLink page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(ticketDataLinkPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TicketDataLink page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/ticket-data-link/new$'));
        cy.getEntityCreateUpdateHeading('TicketDataLink');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketDataLinkPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/ticket-data-links',
          body: ticketDataLinkSample,
        }).then(({ body }) => {
          ticketDataLink = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/ticket-data-links+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [ticketDataLink],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(ticketDataLinkPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TicketDataLink page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('ticketDataLink');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketDataLinkPageUrlPattern);
      });

      it('edit button click should load edit TicketDataLink page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TicketDataLink');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketDataLinkPageUrlPattern);
      });

      it('edit button click should load edit TicketDataLink page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TicketDataLink');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketDataLinkPageUrlPattern);
      });

      it('last delete button click should delete instance of TicketDataLink', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('ticketDataLink').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketDataLinkPageUrlPattern);

        ticketDataLink = undefined;
      });
    });
  });

  describe('new TicketDataLink page', () => {
    beforeEach(() => {
      cy.visit(`${ticketDataLinkPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TicketDataLink');
    });

    it('should create an instance of TicketDataLink', () => {
      cy.get(`[data-cy="nodeId"]`).type('10840');
      cy.get(`[data-cy="nodeId"]`).should('have.value', '10840');

      cy.get(`[data-cy="formDataId"]`).type('distant inasmuch');
      cy.get(`[data-cy="formDataId"]`).should('have.value', 'distant inasmuch');

      cy.get(`[data-cy="parentFormDataId"]`).type('upward');
      cy.get(`[data-cy="parentFormDataId"]`).should('have.value', 'upward');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        ticketDataLink = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', ticketDataLinkPageUrlPattern);
    });
  });
});
