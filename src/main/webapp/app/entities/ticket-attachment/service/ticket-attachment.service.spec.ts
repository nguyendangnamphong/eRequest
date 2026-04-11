import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITicketAttachment } from '../ticket-attachment.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../ticket-attachment.test-samples';

import { TicketAttachmentService } from './ticket-attachment.service';

const requireRestSample: ITicketAttachment = {
  ...sampleWithRequiredData,
};

describe('TicketAttachment Service', () => {
  let service: TicketAttachmentService;
  let httpMock: HttpTestingController;
  let expectedResult: ITicketAttachment | ITicketAttachment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TicketAttachmentService);
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

    it('should create a TicketAttachment', () => {
      const ticketAttachment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(ticketAttachment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TicketAttachment', () => {
      const ticketAttachment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(ticketAttachment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TicketAttachment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TicketAttachment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TicketAttachment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTicketAttachmentToCollectionIfMissing', () => {
      it('should add a TicketAttachment to an empty array', () => {
        const ticketAttachment: ITicketAttachment = sampleWithRequiredData;
        expectedResult = service.addTicketAttachmentToCollectionIfMissing([], ticketAttachment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ticketAttachment);
      });

      it('should not add a TicketAttachment to an array that contains it', () => {
        const ticketAttachment: ITicketAttachment = sampleWithRequiredData;
        const ticketAttachmentCollection: ITicketAttachment[] = [
          {
            ...ticketAttachment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTicketAttachmentToCollectionIfMissing(ticketAttachmentCollection, ticketAttachment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TicketAttachment to an array that doesn't contain it", () => {
        const ticketAttachment: ITicketAttachment = sampleWithRequiredData;
        const ticketAttachmentCollection: ITicketAttachment[] = [sampleWithPartialData];
        expectedResult = service.addTicketAttachmentToCollectionIfMissing(ticketAttachmentCollection, ticketAttachment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ticketAttachment);
      });

      it('should add only unique TicketAttachment to an array', () => {
        const ticketAttachmentArray: ITicketAttachment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ticketAttachmentCollection: ITicketAttachment[] = [sampleWithRequiredData];
        expectedResult = service.addTicketAttachmentToCollectionIfMissing(ticketAttachmentCollection, ...ticketAttachmentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ticketAttachment: ITicketAttachment = sampleWithRequiredData;
        const ticketAttachment2: ITicketAttachment = sampleWithPartialData;
        expectedResult = service.addTicketAttachmentToCollectionIfMissing([], ticketAttachment, ticketAttachment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ticketAttachment);
        expect(expectedResult).toContain(ticketAttachment2);
      });

      it('should accept null and undefined values', () => {
        const ticketAttachment: ITicketAttachment = sampleWithRequiredData;
        expectedResult = service.addTicketAttachmentToCollectionIfMissing([], null, ticketAttachment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ticketAttachment);
      });

      it('should return initial array if no TicketAttachment is added', () => {
        const ticketAttachmentCollection: ITicketAttachment[] = [sampleWithRequiredData];
        expectedResult = service.addTicketAttachmentToCollectionIfMissing(ticketAttachmentCollection, undefined, null);
        expect(expectedResult).toEqual(ticketAttachmentCollection);
      });
    });

    describe('compareTicketAttachment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTicketAttachment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTicketAttachment(entity1, entity2);
        const compareResult2 = service.compareTicketAttachment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTicketAttachment(entity1, entity2);
        const compareResult2 = service.compareTicketAttachment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTicketAttachment(entity1, entity2);
        const compareResult2 = service.compareTicketAttachment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
