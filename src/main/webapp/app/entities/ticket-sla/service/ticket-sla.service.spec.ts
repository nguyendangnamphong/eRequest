import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITicketSLA } from '../ticket-sla.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../ticket-sla.test-samples';

import { RestTicketSLA, TicketSLAService } from './ticket-sla.service';

const requireRestSample: RestTicketSLA = {
  ...sampleWithRequiredData,
  deadline: sampleWithRequiredData.deadline?.toJSON(),
  remindAt: sampleWithRequiredData.remindAt?.toJSON(),
};

describe('TicketSLA Service', () => {
  let service: TicketSLAService;
  let httpMock: HttpTestingController;
  let expectedResult: ITicketSLA | ITicketSLA[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TicketSLAService);
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

    it('should create a TicketSLA', () => {
      const ticketSLA = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(ticketSLA).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TicketSLA', () => {
      const ticketSLA = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(ticketSLA).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TicketSLA', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TicketSLA', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TicketSLA', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTicketSLAToCollectionIfMissing', () => {
      it('should add a TicketSLA to an empty array', () => {
        const ticketSLA: ITicketSLA = sampleWithRequiredData;
        expectedResult = service.addTicketSLAToCollectionIfMissing([], ticketSLA);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ticketSLA);
      });

      it('should not add a TicketSLA to an array that contains it', () => {
        const ticketSLA: ITicketSLA = sampleWithRequiredData;
        const ticketSLACollection: ITicketSLA[] = [
          {
            ...ticketSLA,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTicketSLAToCollectionIfMissing(ticketSLACollection, ticketSLA);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TicketSLA to an array that doesn't contain it", () => {
        const ticketSLA: ITicketSLA = sampleWithRequiredData;
        const ticketSLACollection: ITicketSLA[] = [sampleWithPartialData];
        expectedResult = service.addTicketSLAToCollectionIfMissing(ticketSLACollection, ticketSLA);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ticketSLA);
      });

      it('should add only unique TicketSLA to an array', () => {
        const ticketSLAArray: ITicketSLA[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ticketSLACollection: ITicketSLA[] = [sampleWithRequiredData];
        expectedResult = service.addTicketSLAToCollectionIfMissing(ticketSLACollection, ...ticketSLAArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ticketSLA: ITicketSLA = sampleWithRequiredData;
        const ticketSLA2: ITicketSLA = sampleWithPartialData;
        expectedResult = service.addTicketSLAToCollectionIfMissing([], ticketSLA, ticketSLA2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ticketSLA);
        expect(expectedResult).toContain(ticketSLA2);
      });

      it('should accept null and undefined values', () => {
        const ticketSLA: ITicketSLA = sampleWithRequiredData;
        expectedResult = service.addTicketSLAToCollectionIfMissing([], null, ticketSLA, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ticketSLA);
      });

      it('should return initial array if no TicketSLA is added', () => {
        const ticketSLACollection: ITicketSLA[] = [sampleWithRequiredData];
        expectedResult = service.addTicketSLAToCollectionIfMissing(ticketSLACollection, undefined, null);
        expect(expectedResult).toEqual(ticketSLACollection);
      });
    });

    describe('compareTicketSLA', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTicketSLA(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTicketSLA(entity1, entity2);
        const compareResult2 = service.compareTicketSLA(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTicketSLA(entity1, entity2);
        const compareResult2 = service.compareTicketSLA(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTicketSLA(entity1, entity2);
        const compareResult2 = service.compareTicketSLA(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
