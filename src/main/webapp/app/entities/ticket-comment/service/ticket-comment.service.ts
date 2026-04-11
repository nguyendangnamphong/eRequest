import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITicketComment, NewTicketComment } from '../ticket-comment.model';

export type PartialUpdateTicketComment = Partial<ITicketComment> & Pick<ITicketComment, 'id'>;

type RestOf<T extends ITicketComment | NewTicketComment> = Omit<T, 'createdAt'> & {
  createdAt?: string | null;
};

export type RestTicketComment = RestOf<ITicketComment>;

export type NewRestTicketComment = RestOf<NewTicketComment>;

export type PartialUpdateRestTicketComment = RestOf<PartialUpdateTicketComment>;

export type EntityResponseType = HttpResponse<ITicketComment>;
export type EntityArrayResponseType = HttpResponse<ITicketComment[]>;

@Injectable({ providedIn: 'root' })
export class TicketCommentService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ticket-comments');

  create(ticketComment: NewTicketComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ticketComment);
    return this.http
      .post<RestTicketComment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(ticketComment: ITicketComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ticketComment);
    return this.http
      .put<RestTicketComment>(`${this.resourceUrl}/${this.getTicketCommentIdentifier(ticketComment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(ticketComment: PartialUpdateTicketComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ticketComment);
    return this.http
      .patch<RestTicketComment>(`${this.resourceUrl}/${this.getTicketCommentIdentifier(ticketComment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTicketComment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTicketComment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTicketCommentIdentifier(ticketComment: Pick<ITicketComment, 'id'>): number {
    return ticketComment.id;
  }

  compareTicketComment(o1: Pick<ITicketComment, 'id'> | null, o2: Pick<ITicketComment, 'id'> | null): boolean {
    return o1 && o2 ? this.getTicketCommentIdentifier(o1) === this.getTicketCommentIdentifier(o2) : o1 === o2;
  }

  addTicketCommentToCollectionIfMissing<Type extends Pick<ITicketComment, 'id'>>(
    ticketCommentCollection: Type[],
    ...ticketCommentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ticketComments: Type[] = ticketCommentsToCheck.filter(isPresent);
    if (ticketComments.length > 0) {
      const ticketCommentCollectionIdentifiers = ticketCommentCollection.map(ticketCommentItem =>
        this.getTicketCommentIdentifier(ticketCommentItem),
      );
      const ticketCommentsToAdd = ticketComments.filter(ticketCommentItem => {
        const ticketCommentIdentifier = this.getTicketCommentIdentifier(ticketCommentItem);
        if (ticketCommentCollectionIdentifiers.includes(ticketCommentIdentifier)) {
          return false;
        }
        ticketCommentCollectionIdentifiers.push(ticketCommentIdentifier);
        return true;
      });
      return [...ticketCommentsToAdd, ...ticketCommentCollection];
    }
    return ticketCommentCollection;
  }

  protected convertDateFromClient<T extends ITicketComment | NewTicketComment | PartialUpdateTicketComment>(ticketComment: T): RestOf<T> {
    return {
      ...ticketComment,
      createdAt: ticketComment.createdAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTicketComment: RestTicketComment): ITicketComment {
    return {
      ...restTicketComment,
      createdAt: restTicketComment.createdAt ? dayjs(restTicketComment.createdAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTicketComment>): HttpResponse<ITicketComment> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTicketComment[]>): HttpResponse<ITicketComment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
