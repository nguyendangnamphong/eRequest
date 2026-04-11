import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../ticket-sla.test-samples';

import { TicketSLAFormService } from './ticket-sla-form.service';

describe('TicketSLA Form Service', () => {
  let service: TicketSLAFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketSLAFormService);
  });

  describe('Service methods', () => {
    describe('createTicketSLAFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTicketSLAFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            deadline: expect.any(Object),
            remindAt: expect.any(Object),
            ticket: expect.any(Object),
          }),
        );
      });

      it('passing ITicketSLA should create a new form with FormGroup', () => {
        const formGroup = service.createTicketSLAFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            deadline: expect.any(Object),
            remindAt: expect.any(Object),
            ticket: expect.any(Object),
          }),
        );
      });
    });

    describe('getTicketSLA', () => {
      it('should return NewTicketSLA for default TicketSLA initial value', () => {
        const formGroup = service.createTicketSLAFormGroup(sampleWithNewData);

        const ticketSLA = service.getTicketSLA(formGroup) as any;

        expect(ticketSLA).toMatchObject(sampleWithNewData);
      });

      it('should return NewTicketSLA for empty TicketSLA initial value', () => {
        const formGroup = service.createTicketSLAFormGroup();

        const ticketSLA = service.getTicketSLA(formGroup) as any;

        expect(ticketSLA).toMatchObject({});
      });

      it('should return ITicketSLA', () => {
        const formGroup = service.createTicketSLAFormGroup(sampleWithRequiredData);

        const ticketSLA = service.getTicketSLA(formGroup) as any;

        expect(ticketSLA).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITicketSLA should not enable id FormControl', () => {
        const formGroup = service.createTicketSLAFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTicketSLA should disable id FormControl', () => {
        const formGroup = service.createTicketSLAFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
