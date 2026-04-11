import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITicketDataLink } from '../ticket-data-link.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../ticket-data-link.test-samples';

import { TicketDataLinkService } from './ticket-data-link.service';

const requireRestSample: ITicketDataLink = {
  ...sampleWithRequiredData,
};

describe('TicketDataLink Service', () => {
  let service: TicketDataLinkService;
  let httpMock: HttpTestingController;
  let expectedResult: ITicketDataLink | ITicketDataLink[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TicketDataLinkService);
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

    it('should create a TicketDataLink', () => {
      const ticketDataLink = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(ticketDataLink).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TicketDataLink', () => {
      const ticketDataLink = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(ticketDataLink).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TicketDataLink', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TicketDataLink', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TicketDataLink', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTicketDataLinkToCollectionIfMissing', () => {
      it('should add a TicketDataLink to an empty array', () => {
        const ticketDataLink: ITicketDataLink = sampleWithRequiredData;
        expectedResult = service.addTicketDataLinkToCollectionIfMissing([], ticketDataLink);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ticketDataLink);
      });

      it('should not add a TicketDataLink to an array that contains it', () => {
        const ticketDataLink: ITicketDataLink = sampleWithRequiredData;
        const ticketDataLinkCollection: ITicketDataLink[] = [
          {
            ...ticketDataLink,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTicketDataLinkToCollectionIfMissing(ticketDataLinkCollection, ticketDataLink);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TicketDataLink to an array that doesn't contain it", () => {
        const ticketDataLink: ITicketDataLink = sampleWithRequiredData;
        const ticketDataLinkCollection: ITicketDataLink[] = [sampleWithPartialData];
        expectedResult = service.addTicketDataLinkToCollectionIfMissing(ticketDataLinkCollection, ticketDataLink);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ticketDataLink);
      });

      it('should add only unique TicketDataLink to an array', () => {
        const ticketDataLinkArray: ITicketDataLink[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ticketDataLinkCollection: ITicketDataLink[] = [sampleWithRequiredData];
        expectedResult = service.addTicketDataLinkToCollectionIfMissing(ticketDataLinkCollection, ...ticketDataLinkArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ticketDataLink: ITicketDataLink = sampleWithRequiredData;
        const ticketDataLink2: ITicketDataLink = sampleWithPartialData;
        expectedResult = service.addTicketDataLinkToCollectionIfMissing([], ticketDataLink, ticketDataLink2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ticketDataLink);
        expect(expectedResult).toContain(ticketDataLink2);
      });

      it('should accept null and undefined values', () => {
        const ticketDataLink: ITicketDataLink = sampleWithRequiredData;
        expectedResult = service.addTicketDataLinkToCollectionIfMissing([], null, ticketDataLink, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ticketDataLink);
      });

      it('should return initial array if no TicketDataLink is added', () => {
        const ticketDataLinkCollection: ITicketDataLink[] = [sampleWithRequiredData];
        expectedResult = service.addTicketDataLinkToCollectionIfMissing(ticketDataLinkCollection, undefined, null);
        expect(expectedResult).toEqual(ticketDataLinkCollection);
      });
    });

    describe('compareTicketDataLink', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTicketDataLink(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTicketDataLink(entity1, entity2);
        const compareResult2 = service.compareTicketDataLink(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTicketDataLink(entity1, entity2);
        const compareResult2 = service.compareTicketDataLink(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTicketDataLink(entity1, entity2);
        const compareResult2 = service.compareTicketDataLink(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
