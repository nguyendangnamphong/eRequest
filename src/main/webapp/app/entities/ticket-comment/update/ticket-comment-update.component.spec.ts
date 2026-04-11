import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ITicket } from 'app/entities/ticket/ticket.model';
import { TicketService } from 'app/entities/ticket/service/ticket.service';
import { TicketCommentService } from '../service/ticket-comment.service';
import { ITicketComment } from '../ticket-comment.model';
import { TicketCommentFormService } from './ticket-comment-form.service';

import { TicketCommentUpdateComponent } from './ticket-comment-update.component';

describe('TicketComment Management Update Component', () => {
  let comp: TicketCommentUpdateComponent;
  let fixture: ComponentFixture<TicketCommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ticketCommentFormService: TicketCommentFormService;
  let ticketCommentService: TicketCommentService;
  let ticketService: TicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TicketCommentUpdateComponent],
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
      .overrideTemplate(TicketCommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TicketCommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ticketCommentFormService = TestBed.inject(TicketCommentFormService);
    ticketCommentService = TestBed.inject(TicketCommentService);
    ticketService = TestBed.inject(TicketService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Ticket query and add missing value', () => {
      const ticketComment: ITicketComment = { id: 456 };
      const ticket: ITicket = { id: 9442 };
      ticketComment.ticket = ticket;

      const ticketCollection: ITicket[] = [{ id: 30637 }];
      jest.spyOn(ticketService, 'query').mockReturnValue(of(new HttpResponse({ body: ticketCollection })));
      const additionalTickets = [ticket];
      const expectedCollection: ITicket[] = [...additionalTickets, ...ticketCollection];
      jest.spyOn(ticketService, 'addTicketToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ticketComment });
      comp.ngOnInit();

      expect(ticketService.query).toHaveBeenCalled();
      expect(ticketService.addTicketToCollectionIfMissing).toHaveBeenCalledWith(
        ticketCollection,
        ...additionalTickets.map(expect.objectContaining),
      );
      expect(comp.ticketsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ticketComment: ITicketComment = { id: 456 };
      const ticket: ITicket = { id: 31825 };
      ticketComment.ticket = ticket;

      activatedRoute.data = of({ ticketComment });
      comp.ngOnInit();

      expect(comp.ticketsSharedCollection).toContain(ticket);
      expect(comp.ticketComment).toEqual(ticketComment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketComment>>();
      const ticketComment = { id: 123 };
      jest.spyOn(ticketCommentFormService, 'getTicketComment').mockReturnValue(ticketComment);
      jest.spyOn(ticketCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ticketComment }));
      saveSubject.complete();

      // THEN
      expect(ticketCommentFormService.getTicketComment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ticketCommentService.update).toHaveBeenCalledWith(expect.objectContaining(ticketComment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketComment>>();
      const ticketComment = { id: 123 };
      jest.spyOn(ticketCommentFormService, 'getTicketComment').mockReturnValue({ id: null });
      jest.spyOn(ticketCommentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketComment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ticketComment }));
      saveSubject.complete();

      // THEN
      expect(ticketCommentFormService.getTicketComment).toHaveBeenCalled();
      expect(ticketCommentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITicketComment>>();
      const ticketComment = { id: 123 };
      jest.spyOn(ticketCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticketComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ticketCommentService.update).toHaveBeenCalled();
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
