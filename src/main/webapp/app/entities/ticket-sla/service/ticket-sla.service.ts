import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITicketSLA, NewTicketSLA } from '../ticket-sla.model';

export type PartialUpdateTicketSLA = Partial<ITicketSLA> & Pick<ITicketSLA, 'id'>;

type RestOf<T extends ITicketSLA | NewTicketSLA> = Omit<T, 'deadline' | 'remindAt'> & {
  deadline?: string | null;
  remindAt?: string | null;
};

export type RestTicketSLA = RestOf<ITicketSLA>;

export type NewRestTicketSLA = RestOf<NewTicketSLA>;

export type PartialUpdateRestTicketSLA = RestOf<PartialUpdateTicketSLA>;

export type EntityResponseType = HttpResponse<ITicketSLA>;
export type EntityArrayResponseType = HttpResponse<ITicketSLA[]>;

@Injectable({ providedIn: 'root' })
export class TicketSLAService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ticket-slas');

  create(ticketSLA: NewTicketSLA): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ticketSLA);
    return this.http
      .post<RestTicketSLA>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(ticketSLA: ITicketSLA): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ticketSLA);
    return this.http
      .put<RestTicketSLA>(`${this.resourceUrl}/${this.getTicketSLAIdentifier(ticketSLA)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(ticketSLA: PartialUpdateTicketSLA): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ticketSLA);
    return this.http
      .patch<RestTicketSLA>(`${this.resourceUrl}/${this.getTicketSLAIdentifier(ticketSLA)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTicketSLA>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTicketSLA[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTicketSLAIdentifier(ticketSLA: Pick<ITicketSLA, 'id'>): number {
    return ticketSLA.id;
  }

  compareTicketSLA(o1: Pick<ITicketSLA, 'id'> | null, o2: Pick<ITicketSLA, 'id'> | null): boolean {
    return o1 && o2 ? this.getTicketSLAIdentifier(o1) === this.getTicketSLAIdentifier(o2) : o1 === o2;
  }

  addTicketSLAToCollectionIfMissing<Type extends Pick<ITicketSLA, 'id'>>(
    ticketSLACollection: Type[],
    ...ticketSLASToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ticketSLAS: Type[] = ticketSLASToCheck.filter(isPresent);
    if (ticketSLAS.length > 0) {
      const ticketSLACollectionIdentifiers = ticketSLACollection.map(ticketSLAItem => this.getTicketSLAIdentifier(ticketSLAItem));
      const ticketSLASToAdd = ticketSLAS.filter(ticketSLAItem => {
        const ticketSLAIdentifier = this.getTicketSLAIdentifier(ticketSLAItem);
        if (ticketSLACollectionIdentifiers.includes(ticketSLAIdentifier)) {
          return false;
        }
        ticketSLACollectionIdentifiers.push(ticketSLAIdentifier);
        return true;
      });
      return [...ticketSLASToAdd, ...ticketSLACollection];
    }
    return ticketSLACollection;
  }

  protected convertDateFromClient<T extends ITicketSLA | NewTicketSLA | PartialUpdateTicketSLA>(ticketSLA: T): RestOf<T> {
    return {
      ...ticketSLA,
      deadline: ticketSLA.deadline?.toJSON() ?? null,
      remindAt: ticketSLA.remindAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTicketSLA: RestTicketSLA): ITicketSLA {
    return {
      ...restTicketSLA,
      deadline: restTicketSLA.deadline ? dayjs(restTicketSLA.deadline) : undefined,
      remindAt: restTicketSLA.remindAt ? dayjs(restTicketSLA.remindAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTicketSLA>): HttpResponse<ITicketSLA> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTicketSLA[]>): HttpResponse<ITicketSLA[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
