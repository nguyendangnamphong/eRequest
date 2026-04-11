import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../ticket-step.test-samples';

import { TicketStepFormService } from './ticket-step-form.service';

describe('TicketStep Form Service', () => {
  let service: TicketStepFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketStepFormService);
  });

  describe('Service methods', () => {
    describe('createTicketStepFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTicketStepFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nodeId: expect.any(Object),
            performerEmail: expect.any(Object),
            status: expect.any(Object),
            startedAt: expect.any(Object),
            finishedAt: expect.any(Object),
            sla: expect.any(Object),
            ticket: expect.any(Object),
          }),
        );
      });

      it('passing ITicketStep should create a new form with FormGroup', () => {
        const formGroup = service.createTicketStepFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nodeId: expect.any(Object),
            performerEmail: expect.any(Object),
            status: expect.any(Object),
            startedAt: expect.any(Object),
            finishedAt: expect.any(Object),
            sla: expect.any(Object),
            ticket: expect.any(Object),
          }),
        );
      });
    });

    describe('getTicketStep', () => {
      it('should return NewTicketStep for default TicketStep initial value', () => {
        const formGroup = service.createTicketStepFormGroup(sampleWithNewData);

        const ticketStep = service.getTicketStep(formGroup) as any;

        expect(ticketStep).toMatchObject(sampleWithNewData);
      });

      it('should return NewTicketStep for empty TicketStep initial value', () => {
        const formGroup = service.createTicketStepFormGroup();

        const ticketStep = service.getTicketStep(formGroup) as any;

        expect(ticketStep).toMatchObject({});
      });

      it('should return ITicketStep', () => {
        const formGroup = service.createTicketStepFormGroup(sampleWithRequiredData);

        const ticketStep = service.getTicketStep(formGroup) as any;

        expect(ticketStep).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITicketStep should not enable id FormControl', () => {
        const formGroup = service.createTicketStepFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTicketStep should disable id FormControl', () => {
        const formGroup = service.createTicketStepFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
