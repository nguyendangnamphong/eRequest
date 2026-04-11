import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../ticket-data-link.test-samples';

import { TicketDataLinkFormService } from './ticket-data-link-form.service';

describe('TicketDataLink Form Service', () => {
  let service: TicketDataLinkFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketDataLinkFormService);
  });

  describe('Service methods', () => {
    describe('createTicketDataLinkFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTicketDataLinkFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nodeId: expect.any(Object),
            formDataId: expect.any(Object),
            parentFormDataId: expect.any(Object),
            ticket: expect.any(Object),
          }),
        );
      });

      it('passing ITicketDataLink should create a new form with FormGroup', () => {
        const formGroup = service.createTicketDataLinkFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nodeId: expect.any(Object),
            formDataId: expect.any(Object),
            parentFormDataId: expect.any(Object),
            ticket: expect.any(Object),
          }),
        );
      });
    });

    describe('getTicketDataLink', () => {
      it('should return NewTicketDataLink for default TicketDataLink initial value', () => {
        const formGroup = service.createTicketDataLinkFormGroup(sampleWithNewData);

        const ticketDataLink = service.getTicketDataLink(formGroup) as any;

        expect(ticketDataLink).toMatchObject(sampleWithNewData);
      });

      it('should return NewTicketDataLink for empty TicketDataLink initial value', () => {
        const formGroup = service.createTicketDataLinkFormGroup();

        const ticketDataLink = service.getTicketDataLink(formGroup) as any;

        expect(ticketDataLink).toMatchObject({});
      });

      it('should return ITicketDataLink', () => {
        const formGroup = service.createTicketDataLinkFormGroup(sampleWithRequiredData);

        const ticketDataLink = service.getTicketDataLink(formGroup) as any;

        expect(ticketDataLink).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITicketDataLink should not enable id FormControl', () => {
        const formGroup = service.createTicketDataLinkFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTicketDataLink should disable id FormControl', () => {
        const formGroup = service.createTicketDataLinkFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
