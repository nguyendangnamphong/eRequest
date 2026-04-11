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

describe('TicketAttachment e2e test', () => {
  const ticketAttachmentPageUrl = '/ticket-attachment';
  const ticketAttachmentPageUrlPattern = new RegExp('/ticket-attachment(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const ticketAttachmentSample = { fileId: 'vivaciously why' };

  let ticketAttachment;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/ticket-attachments+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/ticket-attachments').as('postEntityRequest');
    cy.intercept('DELETE', '/api/ticket-attachments/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (ticketAttachment) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/ticket-attachments/${ticketAttachment.id}`,
      }).then(() => {
        ticketAttachment = undefined;
      });
    }
  });

  it('TicketAttachments menu should load TicketAttachments page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ticket-attachment');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TicketAttachment').should('exist');
    cy.url().should('match', ticketAttachmentPageUrlPattern);
  });

  describe('TicketAttachment page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(ticketAttachmentPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TicketAttachment page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/ticket-attachment/new$'));
        cy.getEntityCreateUpdateHeading('TicketAttachment');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketAttachmentPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/ticket-attachments',
          body: ticketAttachmentSample,
        }).then(({ body }) => {
          ticketAttachment = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/ticket-attachments+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [ticketAttachment],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(ticketAttachmentPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TicketAttachment page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('ticketAttachment');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketAttachmentPageUrlPattern);
      });

      it('edit button click should load edit TicketAttachment page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TicketAttachment');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketAttachmentPageUrlPattern);
      });

      it('edit button click should load edit TicketAttachment page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TicketAttachment');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketAttachmentPageUrlPattern);
      });

      it('last delete button click should delete instance of TicketAttachment', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('ticketAttachment').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketAttachmentPageUrlPattern);

        ticketAttachment = undefined;
      });
    });
  });

  describe('new TicketAttachment page', () => {
    beforeEach(() => {
      cy.visit(`${ticketAttachmentPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TicketAttachment');
    });

    it('should create an instance of TicketAttachment', () => {
      cy.get(`[data-cy="fileId"]`).type('gee persecute synergy');
      cy.get(`[data-cy="fileId"]`).should('have.value', 'gee persecute synergy');

      cy.get(`[data-cy="fileName"]`).type('but palate majestically');
      cy.get(`[data-cy="fileName"]`).should('have.value', 'but palate majestically');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        ticketAttachment = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', ticketAttachmentPageUrlPattern);
    });
  });
});
