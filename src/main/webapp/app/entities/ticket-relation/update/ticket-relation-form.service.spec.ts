import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../ticket-relation.test-samples';

import { TicketRelationFormService } from './ticket-relation-form.service';

describe('TicketRelation Form Service', () => {
  let service: TicketRelationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketRelationFormService);
  });

  describe('Service methods', () => {
    describe('createTicketRelationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTicketRelationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            relatedTicketId: expect.any(Object),
            ticket: expect.any(Object),
          }),
        );
      });

      it('passing ITicketRelation should create a new form with FormGroup', () => {
        const formGroup = service.createTicketRelationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            relatedTicketId: expect.any(Object),
            ticket: expect.any(Object),
          }),
        );
      });
    });

    describe('getTicketRelation', () => {
      it('should return NewTicketRelation for default TicketRelation initial value', () => {
        const formGroup = service.createTicketRelationFormGroup(sampleWithNewData);

        const ticketRelation = service.getTicketRelation(formGroup) as any;

        expect(ticketRelation).toMatchObject(sampleWithNewData);
      });

      it('should return NewTicketRelation for empty TicketRelation initial value', () => {
        const formGroup = service.createTicketRelationFormGroup();

        const ticketRelation = service.getTicketRelation(formGroup) as any;

        expect(ticketRelation).toMatchObject({});
      });

      it('should return ITicketRelation', () => {
        const formGroup = service.createTicketRelationFormGroup(sampleWithRequiredData);

        const ticketRelation = service.getTicketRelation(formGroup) as any;

        expect(ticketRelation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITicketRelation should not enable id FormControl', () => {
        const formGroup = service.createTicketRelationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTicketRelation should disable id FormControl', () => {
        const formGroup = service.createTicketRelationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
