import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ITicket } from 'app/entities/ticket/ticket.model';
import { TicketService } from 'app/entities/ticket/service/ticket.service';
import { TicketRelationService } from '../service/ticket-relation.service';
import { ITicketRelation } from '../ticket-relation.model';
import { TicketRelationFormService } from './ticket-relation-form.service';

import { TicketRelationUpdateComponent } from './ticket-relation-update.component';

describe('TicketRelation Management Update Component', () => {
  let comp: TicketRelationUpdateComponent;
  let fixture: ComponentFixture<TicketRelationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ticketRelationFormService: TicketRelationFormService;
  let ticketRelationService: TicketRelationService;
  let ticketService: TicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TicketRelationUpdateComponent],
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
      .overrideTemplate(TicketRelationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TicketRelationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ticketRelationFormService = TestBed.inject(TicketRelationFormService);
    ticketRelationService = TestBed.inject(TicketRelationService);
    ticketService = TestBed.inject(TicketService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Ticket query and add missing value', () => {
      const ticketRelation: ITicketRelation = { id: 456 };
      const ticket: ITicket = { id: 24562 };
      ticketRelation.ticket = ticket;

      const ticketCollection: ITicket[] = [{ id: 22921 }];
      jest.spyOn(ticketService, 'query').mockReturnValue(of(new HttpResponse({ body: ticketCollection })));
      const additionalTickets = [ticket];
      const expectedCollection: ITicket[] = [...additionalTickets, ...ticketCollection];
      jest.spyOn(ticketService, 'addTicketToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ticketRelation });
      comp.ngOnInit();

      expect(ticketService.query).toHaveBeenCalled();
      expect(ticketService.addTicketToCollectionIfMissing).toHaveBeenCalledWith(
        ticketCollection,
        ...additionalTickets.map(expect.objectContaining),
      );
      expect(comp.ticketsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ticketRelation: ITicketRelation = { id: 456 };
      const ticket: ITicket = { id: 32099 };
      ticketRelation.ticket = ticket;

      activatedRoute.data = of({ ticketRelation });
      comp.ngOnInit();

      expect(comp.ticketsSharedCollection).toContain(ticket);
      expect(comp.ticketRelation).toEqual(ticketRelation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketRelation>>();
      const ticketRelation = { id: 123 };
      jest.spyOn(ticketRelationFormService, 'getTicketRelation').mockReturnValue(ticketRelation);
      jest.spyOn(ticketRelationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketRelation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ticketRelation }));
      saveSubject.complete();

      // THEN
      expect(ticketRelationFormService.getTicketRelation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ticketRelationService.update).toHaveBeenCalledWith(expect.objectContaining(ticketRelation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketRelation>>();
      const ticketRelation = { id: 123 };
      jest.spyOn(ticketRelationFormService, 'getTicketRelation').mockReturnValue({ id: null });
      jest.spyOn(ticketRelationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketRelation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ticketRelation }));
      saveSubject.complete();

      // THEN
      expect(ticketRelationFormService.getTicketRelation).toHaveBeenCalled();
      expect(ticketRelationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketRelation>>();
      const ticketRelation = { id: 123 };
      jest.spyOn(ticketRelationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketRelation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ticketRelationService.update).toHaveBeenCalled();
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
