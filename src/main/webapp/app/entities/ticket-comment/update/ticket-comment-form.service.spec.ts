import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../ticket-comment.test-samples';

import { TicketCommentFormService } from './ticket-comment-form.service';

describe('TicketComment Form Service', () => {
  let service: TicketCommentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketCommentFormService);
  });

  describe('Service methods', () => {
    describe('createTicketCommentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTicketCommentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            authorEmail: expect.any(Object),
            content: expect.any(Object),
            createdAt: expect.any(Object),
            ticket: expect.any(Object),
          }),
        );
      });

      it('passing ITicketComment should create a new form with FormGroup', () => {
        const formGroup = service.createTicketCommentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            authorEmail: expect.any(Object),
            content: expect.any(Object),
            createdAt: expect.any(Object),
            ticket: expect.any(Object),
          }),
        );
      });
    });

    describe('getTicketComment', () => {
      it('should return NewTicketComment for default TicketComment initial value', () => {
        const formGroup = service.createTicketCommentFormGroup(sampleWithNewData);

        const ticketComment = service.getTicketComment(formGroup) as any;

        expect(ticketComment).toMatchObject(sampleWithNewData);
      });

      it('should return NewTicketComment for empty TicketComment initial value', () => {
        const formGroup = service.createTicketCommentFormGroup();

        const ticketComment = service.getTicketComment(formGroup) as any;

        expect(ticketComment).toMatchObject({});
      });

      it('should return ITicketComment', () => {
        const formGroup = service.createTicketCommentFormGroup(sampleWithRequiredData);

        const ticketComment = service.getTicketComment(formGroup) as any;

        expect(ticketComment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITicketComment should not enable id FormControl', () => {
        const formGroup = service.createTicketCommentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTicketComment should disable id FormControl', () => {
        const formGroup = service.createTicketCommentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
