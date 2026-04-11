import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITicketStep } from '../ticket-step.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../ticket-step.test-samples';

import { RestTicketStep, TicketStepService } from './ticket-step.service';

const requireRestSample: RestTicketStep = {
  ...sampleWithRequiredData,
  startedAt: sampleWithRequiredData.startedAt?.toJSON(),
  finishedAt: sampleWithRequiredData.finishedAt?.toJSON(),
};

describe('TicketStep Service', () => {
  let service: TicketStepService;
  let httpMock: HttpTestingController;
  let expectedResult: ITicketStep | ITicketStep[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TicketStepService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a TicketStep', () => {
      const ticketStep = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(ticketStep).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TicketStep', () => {
      const ticketStep = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(ticketStep).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TicketStep', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TicketStep', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TicketStep', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTicketStepToCollectionIfMissing', () => {
      it('should add a TicketStep to an empty array', () => {
        const ticketStep: ITicketStep = sampleWithRequiredData;
        expectedResult = service.addTicketStepToCollectionIfMissing([], ticketStep);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ticketStep);
      });

      it('should not add a TicketStep to an array that contains it', () => {
        const ticketStep: ITicketStep = sampleWithRequiredData;
        const ticketStepCollection: ITicketStep[] = [
          {
            ...ticketStep,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTicketStepToCollectionIfMissing(ticketStepCollection, ticketStep);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TicketStep to an array that doesn't contain it", () => {
        const ticketStep: ITicketStep = sampleWithRequiredData;
        const ticketStepCollection: ITicketStep[] = [sampleWithPartialData];
        expectedResult = service.addTicketStepToCollectionIfMissing(ticketStepCollection, ticketStep);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ticketStep);
      });

      it('should add only unique TicketStep to an array', () => {
        const ticketStepArray: ITicketStep[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ticketStepCollection: ITicketStep[] = [sampleWithRequiredData];
        expectedResult = service.addTicketStepToCollectionIfMissing(ticketStepCollection, ...ticketStepArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ticketStep: ITicketStep = sampleWithRequiredData;
        const ticketStep2: ITicketStep = sampleWithPartialData;
        expectedResult = service.addTicketStepToCollectionIfMissing([], ticketStep, ticketStep2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ticketStep);
        expect(expectedResult).toContain(ticketStep2);
      });

      it('should accept null and undefined values', () => {
        const ticketStep: ITicketStep = sampleWithRequiredData;
        expectedResult = service.addTicketStepToCollectionIfMissing([], null, ticketStep, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ticketStep);
      });

      it('should return initial array if no TicketStep is added', () => {
        const ticketStepCollection: ITicketStep[] = [sampleWithRequiredData];
        expectedResult = service.addTicketStepToCollectionIfMissing(ticketStepCollection, undefined, null);
        expect(expectedResult).toEqual(ticketStepCollection);
      });
    });

    describe('compareTicketStep', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTicketStep(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTicketStep(entity1, entity2);
        const compareResult2 = service.compareTicketStep(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTicketStep(entity1, entity2);
        const compareResult2 = service.compareTicketStep(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTicketStep(entity1, entity2);
        const compareResult2 = service.compareTicketStep(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
