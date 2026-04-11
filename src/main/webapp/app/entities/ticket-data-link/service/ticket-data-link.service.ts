import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITicketDataLink, NewTicketDataLink } from '../ticket-data-link.model';

export type PartialUpdateTicketDataLink = Partial<ITicketDataLink> & Pick<ITicketDataLink, 'id'>;

export type EntityResponseType = HttpResponse<ITicketDataLink>;
export type EntityArrayResponseType = HttpResponse<ITicketDataLink[]>;

@Injectable({ providedIn: 'root' })
export class TicketDataLinkService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ticket-data-links');

  create(ticketDataLink: NewTicketDataLink): Observable<EntityResponseType> {
    return this.http.post<ITicketDataLink>(this.resourceUrl, ticketDataLink, { observe: 'response' });
  }

  update(ticketDataLink: ITicketDataLink): Observable<EntityResponseType> {
    return this.http.put<ITicketDataLink>(`${this.resourceUrl}/${this.getTicketDataLinkIdentifier(ticketDataLink)}`, ticketDataLink, {
      observe: 'response',
    });
  }

  partialUpdate(ticketDataLink: PartialUpdateTicketDataLink): Observable<EntityResponseType> {
    return this.http.patch<ITicketDataLink>(`${this.resourceUrl}/${this.getTicketDataLinkIdentifier(ticketDataLink)}`, ticketDataLink, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITicketDataLink>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITicketDataLink[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTicketDataLinkIdentifier(ticketDataLink: Pick<ITicketDataLink, 'id'>): number {
    return ticketDataLink.id;
  }

  compareTicketDataLink(o1: Pick<ITicketDataLink, 'id'> | null, o2: Pick<ITicketDataLink, 'id'> | null): boolean {
    return o1 && o2 ? this.getTicketDataLinkIdentifier(o1) === this.getTicketDataLinkIdentifier(o2) : o1 === o2;
  }

  addTicketDataLinkToCollectionIfMissing<Type extends Pick<ITicketDataLink, 'id'>>(
    ticketDataLinkCollection: Type[],
    ...ticketDataLinksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ticketDataLinks: Type[] = ticketDataLinksToCheck.filter(isPresent);
    if (ticketDataLinks.length > 0) {
      const ticketDataLinkCollectionIdentifiers = ticketDataLinkCollection.map(ticketDataLinkItem =>
        this.getTicketDataLinkIdentifier(ticketDataLinkItem),
      );
      const ticketDataLinksToAdd = ticketDataLinks.filter(ticketDataLinkItem => {
        const ticketDataLinkIdentifier = this.getTicketDataLinkIdentifier(ticketDataLinkItem);
        if (ticketDataLinkCollectionIdentifiers.includes(ticketDataLinkIdentifier)) {
          return false;
        }
        ticketDataLinkCollectionIdentifiers.push(ticketDataLinkIdentifier);
        return true;
      });
      return [...ticketDataLinksToAdd, ...ticketDataLinkCollection];
    }
    return ticketDataLinkCollection;
  }
}
