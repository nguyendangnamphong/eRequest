import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ITicketSLA } from 'app/entities/ticket-sla/ticket-sla.model';
import { TicketSLAService } from 'app/entities/ticket-sla/service/ticket-sla.service';
import { ITicket } from 'app/entities/ticket/ticket.model';
import { TicketService } from 'app/entities/ticket/service/ticket.service';
import { ITicketStep } from '../ticket-step.model';
import { TicketStepService } from '../service/ticket-step.service';
import { TicketStepFormService } from './ticket-step-form.service';

import { TicketStepUpdateComponent } from './ticket-step-update.component';

describe('TicketStep Management Update Component', () => {
  let comp: TicketStepUpdateComponent;
  let fixture: ComponentFixture<TicketStepUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ticketStepFormService: TicketStepFormService;
  let ticketStepService: TicketStepService;
  let ticketSLAService: TicketSLAService;
  let ticketService: TicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TicketStepUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TicketStepUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TicketStepUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ticketStepFormService = TestBed.inject(TicketStepFormService);
    ticketStepService = TestBed.inject(TicketStepService);
    ticketSLAService = TestBed.inject(TicketSLAService);
    ticketService = TestBed.inject(TicketService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call sla query and add missing value', () => {
      const ticketStep: ITicketStep = { id: 456 };
      const sla: ITicketSLA = { id: 4051 };
      ticketStep.sla = sla;

      const slaCollection: ITicketSLA[] = [{ id: 9594 }];
      jest.spyOn(ticketSLAService, 'query').mockReturnValue(of(new HttpResponse({ body: slaCollection })));
      const expectedCollection: ITicketSLA[] = [sla, ...slaCollection];
      jest.spyOn(ticketSLAService, 'addTicketSLAToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ticketStep });
      comp.ngOnInit();

      expect(ticketSLAService.query).toHaveBeenCalled();
      expect(ticketSLAService.addTicketSLAToCollectionIfMissing).toHaveBeenCalledWith(slaCollection, sla);
      expect(comp.slasCollection).toEqual(expectedCollection);
    });

    it('Should call Ticket query and add missing value', () => {
      const ticketStep: ITicketStep = { id: 456 };
      const ticket: ITicket = { id: 26225 };
      ticketStep.ticket = ticket;

      const ticketCollection: ITicket[] = [{ id: 7219 }];
      jest.spyOn(ticketService, 'query').mockReturnValue(of(new HttpResponse({ body: ticketCollection })));
      const additionalTickets = [ticket];
      const expectedCollection: ITicket[] = [...additionalTickets, ...ticketCollection];
      jest.spyOn(ticketService, 'addTicketToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ticketStep });
      comp.ngOnInit();

      expect(ticketService.query).toHaveBeenCalled();
      expect(ticketService.addTicketToCollectionIfMissing).toHaveBeenCalledWith(
        ticketCollection,
        ...additionalTickets.map(expect.objectContaining),
      );
      expect(comp.ticketsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ticketStep: ITicketStep = { id: 456 };
      const sla: ITicketSLA = { id: 18948 };
      ticketStep.sla = sla;
      const ticket: ITicket = { id: 32584 };
      ticketStep.ticket = ticket;

      activatedRoute.data = of({ ticketStep });
      comp.ngOnInit();

      expect(comp.slasCollection).toContain(sla);
      expect(comp.ticketsSharedCollection).toContain(ticket);
      expect(comp.ticketStep).toEqual(ticketStep);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketStep>>();
      const ticketStep = { id: 123 };
      jest.spyOn(ticketStepFormService, 'getTicketStep').mockReturnValue(ticketStep);
      jest.spyOn(ticketStepService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketStep });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ticketStep }));
      saveSubject.complete();

      // THEN
      expect(ticketStepFormService.getTicketStep).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ticketStepService.update).toHaveBeenCalledWith(expect.objectContaining(ticketStep));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketStep>>();
      const ticketStep = { id: 123 };
      jest.spyOn(ticketStepFormService, 'getTicketStep').mockReturnValue({ id: null });
      jest.spyOn(ticketStepService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketStep: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ticketStep }));
      saveSubject.complete();

      // THEN
      expect(ticketStepFormService.getTicketStep).toHaveBeenCalled();
      expect(ticketStepService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketStep>>();
      const ticketStep = { id: 123 };
      jest.spyOn(ticketStepService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketStep });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ticketStepService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTicketSLA', () => {
      it('Should forward to ticketSLAService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(ticketSLAService, 'compareTicketSLA');
        comp.compareTicketSLA(entity, entity2);
        expect(ticketSLAService.compareTicketSLA).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTicket', () => {
      it('Should forward to ticketService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(ticketService, 'compareTicket');
        comp.compareTicket(entity, entity2);
        expect(ticketService.compareTicket).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
