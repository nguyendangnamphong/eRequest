import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { TicketSLADetailComponent } from './ticket-sla-detail.component';

describe('TicketSLA Management Detail Component', () => {
  let comp: TicketSLADetailComponent;
  let fixture: ComponentFixture<TicketSLADetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketSLADetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./ticket-sla-detail.component').then(m => m.TicketSLADetailComponent),
              resolve: { ticketSLA: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TicketSLADetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketSLADetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ticketSLA on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TicketSLADetailComponent);

      // THEN
      expect(instance.ticketSLA()).toEqual(expect.objectContaining({ id: 123 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
