import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITicketRelation, NewTicketRelation } from '../ticket-relation.model';

export type PartialUpdateTicketRelation = Partial<ITicketRelation> & Pick<ITicketRelation, 'id'>;

export type EntityResponseType = HttpResponse<ITicketRelation>;
export type EntityArrayResponseType = HttpResponse<ITicketRelation[]>;

@Injectable({ providedIn: 'root' })
export class TicketRelationService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ticket-relations');

  create(ticketRelation: NewTicketRelation): Observable<EntityResponseType> {
    return this.http.post<ITicketRelation>(this.resourceUrl, ticketRelation, { observe: 'response' });
  }

  update(ticketRelation: ITicketRelation): Observable<EntityResponseType> {
    return this.http.put<ITicketRelation>(`${this.resourceUrl}/${this.getTicketRelationIdentifier(ticketRelation)}`, ticketRelation, {
      observe: 'response',
    });
  }

  partialUpdate(ticketRelation: PartialUpdateTicketRelation): Observable<EntityResponseType> {
    return this.http.patch<ITicketRelation>(`${this.resourceUrl}/${this.getTicketRelationIdentifier(ticketRelation)}`, ticketRelation, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITicketRelation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITicketRelation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTicketRelationIdentifier(ticketRelation: Pick<ITicketRelation, 'id'>): number {
    return ticketRelation.id;
  }

  compareTicketRelation(o1: Pick<ITicketRelation, 'id'> | null, o2: Pick<ITicketRelation, 'id'> | null): boolean {
    return o1 && o2 ? this.getTicketRelationIdentifier(o1) === this.getTicketRelationIdentifier(o2) : o1 === o2;
  }

  addTicketRelationToCollectionIfMissing<Type extends Pick<ITicketRelation, 'id'>>(
    ticketRelationCollection: Type[],
    ...ticketRelationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ticketRelations: Type[] = ticketRelationsToCheck.filter(isPresent);
    if (ticketRelations.length > 0) {
      const ticketRelationCollectionIdentifiers = ticketRelationCollection.map(ticketRelationItem =>
        this.getTicketRelationIdentifier(ticketRelationItem),
      );
      const ticketRelationsToAdd = ticketRelations.filter(ticketRelationItem => {
        const ticketRelationIdentifier = this.getTicketRelationIdentifier(ticketRelationItem);
        if (ticketRelationCollectionIdentifiers.includes(ticketRelationIdentifier)) {
          return false;
        }
        ticketRelationCollectionIdentifiers.push(ticketRelationIdentifier);
        return true;
      });
      return [...ticketRelationsToAdd, ...ticketRelationCollection];
    }
    return ticketRelationCollection;
  }
}
