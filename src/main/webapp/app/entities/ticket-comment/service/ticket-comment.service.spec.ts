import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITicketComment } from '../ticket-comment.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../ticket-comment.test-samples';

import { RestTicketComment, TicketCommentService } from './ticket-comment.service';

const requireRestSample: RestTicketComment = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
};

describe('TicketComment Service', () => {
  let service: TicketCommentService;
  let httpMock: HttpTestingController;
  let expectedResult: ITicketComment | ITicketComment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TicketCommentService);
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

    it('should create a TicketComment', () => {
      const ticketComment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(ticketComment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TicketComment', () => {
      const ticketComment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(ticketComment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TicketComment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TicketComment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TicketComment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTicketCommentToCollectionIfMissing', () => {
      it('should add a TicketComment to an empty array', () => {
        const ticketComment: ITicketComment = sampleWithRequiredData;
        expectedResult = service.addTicketCommentToCollectionIfMissing([], ticketComment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ticketComment);
      });

      it('should not add a TicketComment to an array that contains it', () => {
        const ticketComment: ITicketComment = sampleWithRequiredData;
        const ticketCommentCollection: ITicketComment[] = [
          {
            ...ticketComment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTicketCommentToCollectionIfMissing(ticketCommentCollection, ticketComment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TicketComment to an array that doesn't contain it", () => {
        const ticketComment: ITicketComment = sampleWithRequiredData;
        const ticketCommentCollection: ITicketComment[] = [sampleWithPartialData];
        expectedResult = service.addTicketCommentToCollectionIfMissing(ticketCommentCollection, ticketComment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ticketComment);
      });

      it('should add only unique TicketComment to an array', () => {
        const ticketCommentArray: ITicketComment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ticketCommentCollection: ITicketComment[] = [sampleWithRequiredData];
        expectedResult = service.addTicketCommentToCollectionIfMissing(ticketCommentCollection, ...ticketCommentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ticketComment: ITicketComment = sampleWithRequiredData;
        const ticketComment2: ITicketComment = sampleWithPartialData;
        expectedResult = service.addTicketCommentToCollectionIfMissing([], ticketComment, ticketComment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ticketComment);
        expect(expectedResult).toContain(ticketComment2);
      });

      it('should accept null and undefined values', () => {
        const ticketComment: ITicketComment = sampleWithRequiredData;
        expectedResult = service.addTicketCommentToCollectionIfMissing([], null, ticketComment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ticketComment);
      });

      it('should return initial array if no TicketComment is added', () => {
        const ticketCommentCollection: ITicketComment[] = [sampleWithRequiredData];
        expectedResult = service.addTicketCommentToCollectionIfMissing(ticketCommentCollection, undefined, null);
        expect(expectedResult).toEqual(ticketCommentCollection);
      });
    });

    describe('compareTicketComment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTicketComment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTicketComment(entity1, entity2);
        const compareResult2 = service.compareTicketComment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTicketComment(entity1, entity2);
        const compareResult2 = service.compareTicketComment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTicketComment(entity1, entity2);
        const compareResult2 = service.compareTicketComment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
