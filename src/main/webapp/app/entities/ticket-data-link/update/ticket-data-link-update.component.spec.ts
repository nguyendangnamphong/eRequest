import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ITicket } from 'app/entities/ticket/ticket.model';
import { TicketService } from 'app/entities/ticket/service/ticket.service';
import { TicketDataLinkService } from '../service/ticket-data-link.service';
import { ITicketDataLink } from '../ticket-data-link.model';
import { TicketDataLinkFormService } from './ticket-data-link-form.service';

import { TicketDataLinkUpdateComponent } from './ticket-data-link-update.component';

describe('TicketDataLink Management Update Component', () => {
  let comp: TicketDataLinkUpdateComponent;
  let fixture: ComponentFixture<TicketDataLinkUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ticketDataLinkFormService: TicketDataLinkFormService;
  let ticketDataLinkService: TicketDataLinkService;
  let ticketService: TicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TicketDataLinkUpdateComponent],
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
      .overrideTemplate(TicketDataLinkUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TicketDataLinkUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ticketDataLinkFormService = TestBed.inject(TicketDataLinkFormService);
    ticketDataLinkService = TestBed.inject(TicketDataLinkService);
    ticketService = TestBed.inject(TicketService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Ticket query and add missing value', () => {
      const ticketDataLink: ITicketDataLink = { id: 456 };
      const ticket: ITicket = { id: 8749 };
      ticketDataLink.ticket = ticket;

      const ticketCollection: ITicket[] = [{ id: 26194 }];
      jest.spyOn(ticketService, 'query').mockReturnValue(of(new HttpResponse({ body: ticketCollection })));
      const additionalTickets = [ticket];
      const expectedCollection: ITicket[] = [...additionalTickets, ...ticketCollection];
      jest.spyOn(ticketService, 'addTicketToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ticketDataLink });
      comp.ngOnInit();

      expect(ticketService.query).toHaveBeenCalled();
      expect(ticketService.addTicketToCollectionIfMissing).toHaveBeenCalledWith(
        ticketCollection,
        ...additionalTickets.map(expect.objectContaining),
      );
      expect(comp.ticketsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ticketDataLink: ITicketDataLink = { id: 456 };
      const ticket: ITicket = { id: 29898 };
      ticketDataLink.ticket = ticket;

      activatedRoute.data = of({ ticketDataLink });
      comp.ngOnInit();

      expect(comp.ticketsSharedCollection).toContain(ticket);
      expect(comp.ticketDataLink).toEqual(ticketDataLink);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketDataLink>>();
      const ticketDataLink = { id: 123 };
      jest.spyOn(ticketDataLinkFormService, 'getTicketDataLink').mockReturnValue(ticketDataLink);
      jest.spyOn(ticketDataLinkService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketDataLink });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ticketDataLink }));
      saveSubject.complete();

      // THEN
      expect(ticketDataLinkFormService.getTicketDataLink).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ticketDataLinkService.update).toHaveBeenCalledWith(expect.objectContaining(ticketDataLink));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketDataLink>>();
      const ticketDataLink = { id: 123 };
      jest.spyOn(ticketDataLinkFormService, 'getTicketDataLink').mockReturnValue({ id: null });
      jest.spyOn(ticketDataLinkService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketDataLink: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ticketDataLink }));
      saveSubject.complete();

      // THEN
      expect(ticketDataLinkFormService.getTicketDataLink).toHaveBeenCalled();
      expect(ticketDataLinkService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketDataLink>>();
      const ticketDataLink = { id: 123 };
      jest.spyOn(ticketDataLinkService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketDataLink });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ticketDataLinkService.update).toHaveBeenCalled();
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
