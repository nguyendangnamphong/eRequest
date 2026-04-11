import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../ticket-attachment.test-samples';

import { TicketAttachmentFormService } from './ticket-attachment-form.service';

describe('TicketAttachment Form Service', () => {
  let service: TicketAttachmentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketAttachmentFormService);
  });

  describe('Service methods', () => {
    describe('createTicketAttachmentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTicketAttachmentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fileId: expect.any(Object),
            fileName: expect.any(Object),
            ticket: expect.any(Object),
          }),
        );
      });

      it('passing ITicketAttachment should create a new form with FormGroup', () => {
        const formGroup = service.createTicketAttachmentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fileId: expect.any(Object),
            fileName: expect.any(Object),
            ticket: expect.any(Object),
          }),
        );
      });
    });

    describe('getTicketAttachment', () => {
      it('should return NewTicketAttachment for default TicketAttachment initial value', () => {
        const formGroup = service.createTicketAttachmentFormGroup(sampleWithNewData);

        const ticketAttachment = service.getTicketAttachment(formGroup) as any;

        expect(ticketAttachment).toMatchObject(sampleWithNewData);
      });

      it('should return NewTicketAttachment for empty TicketAttachment initial value', () => {
        const formGroup = service.createTicketAttachmentFormGroup();

        const ticketAttachment = service.getTicketAttachment(formGroup) as any;

        expect(ticketAttachment).toMatchObject({});
      });

      it('should return ITicketAttachment', () => {
        const formGroup = service.createTicketAttachmentFormGroup(sampleWithRequiredData);

        const ticketAttachment = service.getTicketAttachment(formGroup) as any;

        expect(ticketAttachment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITicketAttachment should not enable id FormControl', () => {
        const formGroup = service.createTicketAttachmentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTicketAttachment should disable id FormControl', () => {
        const formGroup = service.createTicketAttachmentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
