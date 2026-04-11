import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ITicket } from 'app/entities/ticket/ticket.model';
import { TicketService } from 'app/entities/ticket/service/ticket.service';
import { TicketAttachmentService } from '../service/ticket-attachment.service';
import { ITicketAttachment } from '../ticket-attachment.model';
import { TicketAttachmentFormService } from './ticket-attachment-form.service';

import { TicketAttachmentUpdateComponent } from './ticket-attachment-update.component';

describe('TicketAttachment Management Update Component', () => {
  let comp: TicketAttachmentUpdateComponent;
  let fixture: ComponentFixture<TicketAttachmentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ticketAttachmentFormService: TicketAttachmentFormService;
  let ticketAttachmentService: TicketAttachmentService;
  let ticketService: TicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TicketAttachmentUpdateComponent],
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
      .overrideTemplate(TicketAttachmentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TicketAttachmentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ticketAttachmentFormService = TestBed.inject(TicketAttachmentFormService);
    ticketAttachmentService = TestBed.inject(TicketAttachmentService);
    ticketService = TestBed.inject(TicketService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Ticket query and add missing value', () => {
      const ticketAttachment: ITicketAttachment = { id: 456 };
      const ticket: ITicket = { id: 2305 };
      ticketAttachment.ticket = ticket;

      const ticketCollection: ITicket[] = [{ id: 26575 }];
      jest.spyOn(ticketService, 'query').mockReturnValue(of(new HttpResponse({ body: ticketCollection })));
      const additionalTickets = [ticket];
      const expectedCollection: ITicket[] = [...additionalTickets, ...ticketCollection];
      jest.spyOn(ticketService, 'addTicketToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ticketAttachment });
      comp.ngOnInit();

      expect(ticketService.query).toHaveBeenCalled();
      expect(ticketService.addTicketToCollectionIfMissing).toHaveBeenCalledWith(
        ticketCollection,
        ...additionalTickets.map(expect.objectContaining),
      );
      expect(comp.ticketsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ticketAttachment: ITicketAttachment = { id: 456 };
      const ticket: ITicket = { id: 13835 };
      ticketAttachment.ticket = ticket;

      activatedRoute.data = of({ ticketAttachment });
      comp.ngOnInit();

      expect(comp.ticketsSharedCollection).toContain(ticket);
      expect(comp.ticketAttachment).toEqual(ticketAttachment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketAttachment>>();
      const ticketAttachment = { id: 123 };
      jest.spyOn(ticketAttachmentFormService, 'getTicketAttachment').mockReturnValue(ticketAttachment);
      jest.spyOn(ticketAttachmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketAttachment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ticketAttachment }));
      saveSubject.complete();

      // THEN
      expect(ticketAttachmentFormService.getTicketAttachment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ticketAttachmentService.update).toHaveBeenCalledWith(expect.objectContaining(ticketAttachment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketAttachment>>();
      const ticketAttachment = { id: 123 };
      jest.spyOn(ticketAttachmentFormService, 'getTicketAttachment').mockReturnValue({ id: null });
      jest.spyOn(ticketAttachmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketAttachment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ticketAttachment }));
      saveSubject.complete();

      // THEN
      expect(ticketAttachmentFormService.getTicketAttachment).toHaveBeenCalled();
      expect(ticketAttachmentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketAttachment>>();
      const ticketAttachment = { id: 123 };
      jest.spyOn(ticketAttachmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketAttachment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ticketAttachmentService.update).toHaveBeenCalled();
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
