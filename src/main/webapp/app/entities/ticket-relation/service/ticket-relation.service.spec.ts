import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITicketRelation } from '../ticket-relation.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../ticket-relation.test-samples';

import { TicketRelationService } from './ticket-relation.service';

const requireRestSample: ITicketRelation = {
  ...sampleWithRequiredData,
};

describe('TicketRelation Service', () => {
  let service: TicketRelationService;
  let httpMock: HttpTestingController;
  let expectedResult: ITicketRelation | ITicketRelation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TicketRelationService);
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

    it('should create a TicketRelation', () => {
      const ticketRelation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(ticketRelation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TicketRelation', () => {
      const ticketRelation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(ticketRelation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TicketRelation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TicketRelation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TicketRelation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTicketRelationToCollectionIfMissing', () => {
      it('should add a TicketRelation to an empty array', () => {
        const ticketRelation: ITicketRelation = sampleWithRequiredData;
        expectedResult = service.addTicketRelationToCollectionIfMissing([], ticketRelation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ticketRelation);
      });

      it('should not add a TicketRelation to an array that contains it', () => {
        const ticketRelation: ITicketRelation = sampleWithRequiredData;
        const ticketRelationCollection: ITicketRelation[] = [
          {
            ...ticketRelation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTicketRelationToCollectionIfMissing(ticketRelationCollection, ticketRelation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TicketRelation to an array that doesn't contain it", () => {
        const ticketRelation: ITicketRelation = sampleWithRequiredData;
        const ticketRelationCollection: ITicketRelation[] = [sampleWithPartialData];
        expectedResult = service.addTicketRelationToCollectionIfMissing(ticketRelationCollection, ticketRelation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ticketRelation);
      });

      it('should add only unique TicketRelation to an array', () => {
        const ticketRelationArray: ITicketRelation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ticketRelationCollection: ITicketRelation[] = [sampleWithRequiredData];
        expectedResult = service.addTicketRelationToCollectionIfMissing(ticketRelationCollection, ...ticketRelationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ticketRelation: ITicketRelation = sampleWithRequiredData;
        const ticketRelation2: ITicketRelation = sampleWithPartialData;
        expectedResult = service.addTicketRelationToCollectionIfMissing([], ticketRelation, ticketRelation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ticketRelation);
        expect(expectedResult).toContain(ticketRelation2);
      });

      it('should accept null and undefined values', () => {
        const ticketRelation: ITicketRelation = sampleWithRequiredData;
        expectedResult = service.addTicketRelationToCollectionIfMissing([], null, ticketRelation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ticketRelation);
      });

      it('should return initial array if no TicketRelation is added', () => {
        const ticketRelationCollection: ITicketRelation[] = [sampleWithRequiredData];
        expectedResult = service.addTicketRelationToCollectionIfMissing(ticketRelationCollection, undefined, null);
        expect(expectedResult).toEqual(ticketRelationCollection);
      });
    });

    describe('compareTicketRelation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTicketRelation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTicketRelation(entity1, entity2);
        const compareResult2 = service.compareTicketRelation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTicketRelation(entity1, entity2);
        const compareResult2 = service.compareTicketRelation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTicketRelation(entity1, entity2);
        const compareResult2 = service.compareTicketRelation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
