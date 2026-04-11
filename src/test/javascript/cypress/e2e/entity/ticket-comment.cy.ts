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

describe('TicketComment e2e test', () => {
  const ticketCommentPageUrl = '/ticket-comment';
  const ticketCommentPageUrlPattern = new RegExp('/ticket-comment(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const ticketCommentSample = { authorEmail: 'meh make preside', content: 'Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci50eHQ=' };

  let ticketComment;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/ticket-comments+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/ticket-comments').as('postEntityRequest');
    cy.intercept('DELETE', '/api/ticket-comments/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (ticketComment) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/ticket-comments/${ticketComment.id}`,
      }).then(() => {
        ticketComment = undefined;
      });
    }
  });

  it('TicketComments menu should load TicketComments page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ticket-comment');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TicketComment').should('exist');
    cy.url().should('match', ticketCommentPageUrlPattern);
  });

  describe('TicketComment page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(ticketCommentPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TicketComment page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/ticket-comment/new$'));
        cy.getEntityCreateUpdateHeading('TicketComment');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketCommentPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/ticket-comments',
          body: ticketCommentSample,
        }).then(({ body }) => {
          ticketComment = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/ticket-comments+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [ticketComment],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(ticketCommentPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TicketComment page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('ticketComment');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketCommentPageUrlPattern);
      });

      it('edit button click should load edit TicketComment page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TicketComment');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketCommentPageUrlPattern);
      });

      it('edit button click should load edit TicketComment page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TicketComment');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketCommentPageUrlPattern);
      });

      it('last delete button click should delete instance of TicketComment', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('ticketComment').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ticketCommentPageUrlPattern);

        ticketComment = undefined;
      });
    });
  });

  describe('new TicketComment page', () => {
    beforeEach(() => {
      cy.visit(`${ticketCommentPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TicketComment');
    });

    it('should create an instance of TicketComment', () => {
      cy.get(`[data-cy="authorEmail"]`).type('making wonderful');
      cy.get(`[data-cy="authorEmail"]`).should('have.value', 'making wonderful');

      cy.get(`[data-cy="content"]`).type('../fake-data/blob/hipster.txt');
      cy.get(`[data-cy="content"]`).invoke('val').should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(`[data-cy="createdAt"]`).type('2026-04-10T16:27');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-04-10T16:27');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        ticketComment = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', ticketCommentPageUrlPattern);
    });
  });
});
