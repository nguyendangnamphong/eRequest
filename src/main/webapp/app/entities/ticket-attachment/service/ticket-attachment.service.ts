import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITicketAttachment, NewTicketAttachment } from '../ticket-attachment.model';

export type PartialUpdateTicketAttachment = Partial<ITicketAttachment> & Pick<ITicketAttachment, 'id'>;

export type EntityResponseType = HttpResponse<ITicketAttachment>;
export type EntityArrayResponseType = HttpResponse<ITicketAttachment[]>;

@Injectable({ providedIn: 'root' })
export class TicketAttachmentService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ticket-attachments');

  create(ticketAttachment: NewTicketAttachment): Observable<EntityResponseType> {
    return this.http.post<ITicketAttachment>(this.resourceUrl, ticketAttachment, { observe: 'response' });
  }

  update(ticketAttachment: ITicketAttachment): Observable<EntityResponseType> {
    return this.http.put<ITicketAttachment>(
      `${this.resourceUrl}/${this.getTicketAttachmentIdentifier(ticketAttachment)}`,
      ticketAttachment,
      { observe: 'response' },
    );
  }

  partialUpdate(ticketAttachment: PartialUpdateTicketAttachment): Observable<EntityResponseType> {
    return this.http.patch<ITicketAttachment>(
      `${this.resourceUrl}/${this.getTicketAttachmentIdentifier(ticketAttachment)}`,
      ticketAttachment,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITicketAttachment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITicketAttachment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTicketAttachmentIdentifier(ticketAttachment: Pick<ITicketAttachment, 'id'>): number {
    return ticketAttachment.id;
  }

  compareTicketAttachment(o1: Pick<ITicketAttachment, 'id'> | null, o2: Pick<ITicketAttachment, 'id'> | null): boolean {
    return o1 && o2 ? this.getTicketAttachmentIdentifier(o1) === this.getTicketAttachmentIdentifier(o2) : o1 === o2;
  }

  addTicketAttachmentToCollectionIfMissing<Type extends Pick<ITicketAttachment, 'id'>>(
    ticketAttachmentCollection: Type[],
    ...ticketAttachmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ticketAttachments: Type[] = ticketAttachmentsToCheck.filter(isPresent);
    if (ticketAttachments.length > 0) {
      const ticketAttachmentCollectionIdentifiers = ticketAttachmentCollection.map(ticketAttachmentItem =>
        this.getTicketAttachmentIdentifier(ticketAttachmentItem),
      );
      const ticketAttachmentsToAdd = ticketAttachments.filter(ticketAttachmentItem => {
        const ticketAttachmentIdentifier = this.getTicketAttachmentIdentifier(ticketAttachmentItem);
        if (ticketAttachmentCollectionIdentifiers.includes(ticketAttachmentIdentifier)) {
          return false;
        }
        ticketAttachmentCollectionIdentifiers.push(ticketAttachmentIdentifier);
        return true;
      });
      return [...ticketAttachmentsToAdd, ...ticketAttachmentCollection];
    }
    return ticketAttachmentCollection;
  }
}
