import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ITicket } from 'app/entities/ticket/ticket.model';
import { TicketService } from 'app/entities/ticket/service/ticket.service';
import { TicketSLAService } from '../service/ticket-sla.service';
import { ITicketSLA } from '../ticket-sla.model';
import { TicketSLAFormService } from './ticket-sla-form.service';

import { TicketSLAUpdateComponent } from './ticket-sla-update.component';

describe('TicketSLA Management Update Component', () => {
  let comp: TicketSLAUpdateComponent;
  let fixture: ComponentFixture<TicketSLAUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ticketSLAFormService: TicketSLAFormService;
  let ticketSLAService: TicketSLAService;
  let ticketService: TicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TicketSLAUpdateComponent],
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
      .overrideTemplate(TicketSLAUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TicketSLAUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ticketSLAFormService = TestBed.inject(TicketSLAFormService);
    ticketSLAService = TestBed.inject(TicketSLAService);
    ticketService = TestBed.inject(TicketService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Ticket query and add missing value', () => {
      const ticketSLA: ITicketSLA = { id: 456 };
      const ticket: ITicket = { id: 17480 };
      ticketSLA.ticket = ticket;

      const ticketCollection: ITicket[] = [{ id: 6708 }];
      jest.spyOn(ticketService, 'query').mockReturnValue(of(new HttpResponse({ body: ticketCollection })));
      const additionalTickets = [ticket];
      const expectedCollection: ITicket[] = [...additionalTickets, ...ticketCollection];
      jest.spyOn(ticketService, 'addTicketToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ticketSLA });
      comp.ngOnInit();

      expect(ticketService.query).toHaveBeenCalled();
      expect(ticketService.addTicketToCollectionIfMissing).toHaveBeenCalledWith(
        ticketCollection,
        ...additionalTickets.map(expect.objectContaining),
      );
      expect(comp.ticketsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ticketSLA: ITicketSLA = { id: 456 };
      const ticket: ITicket = { id: 15896 };
      ticketSLA.ticket = ticket;

      activatedRoute.data = of({ ticketSLA });
      comp.ngOnInit();

      expect(comp.ticketsSharedCollection).toContain(ticket);
      expect(comp.ticketSLA).toEqual(ticketSLA);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketSLA>>();
      const ticketSLA = { id: 123 };
      jest.spyOn(ticketSLAFormService, 'getTicketSLA').mockReturnValue(ticketSLA);
      jest.spyOn(ticketSLAService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketSLA });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ticketSLA }));
      saveSubject.complete();

      // THEN
      expect(ticketSLAFormService.getTicketSLA).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ticketSLAService.update).toHaveBeenCalledWith(expect.objectContaining(ticketSLA));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketSLA>>();
      const ticketSLA = { id: 123 };
      jest.spyOn(ticketSLAFormService, 'getTicketSLA').mockReturnValue({ id: null });
      jest.spyOn(ticketSLAService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketSLA: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ticketSLA }));
      saveSubject.complete();

      // THEN
      expect(ticketSLAFormService.getTicketSLA).toHaveBeenCalled();
      expect(ticketSLAService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketSLA>>();
      const ticketSLA = { id: 123 };
      jest.spyOn(ticketSLAService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketSLA });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ticketSLAService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
