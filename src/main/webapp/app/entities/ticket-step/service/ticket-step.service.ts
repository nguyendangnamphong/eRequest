import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITicketStep, NewTicketStep } from '../ticket-step.model';

export type PartialUpdateTicketStep = Partial<ITicketStep> & Pick<ITicketStep, 'id'>;

type RestOf<T extends ITicketStep | NewTicketStep> = Omit<T, 'startedAt' | 'finishedAt'> & {
  startedAt?: string | null;
  finishedAt?: string | null;
};

export type RestTicketStep = RestOf<ITicketStep>;

export type NewRestTicketStep = RestOf<NewTicketStep>;

export type PartialUpdateRestTicketStep = RestOf<PartialUpdateTicketStep>;

export type EntityResponseType = HttpResponse<ITicketStep>;
export type EntityArrayResponseType = HttpResponse<ITicketStep[]>;

@Injectable({ providedIn: 'root' })
export class TicketStepService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ticket-steps');

  create(ticketStep: NewTicketStep): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ticketStep);
    return this.http
      .post<RestTicketStep>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(ticketStep: ITicketStep): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ticketStep);
    return this.http
      .put<RestTicketStep>(`${this.resourceUrl}/${this.getTicketStepIdentifier(ticketStep)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(ticketStep: PartialUpdateTicketStep): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ticketStep);
    return this.http
      .patch<RestTicketStep>(`${this.resourceUrl}/${this.getTicketStepIdentifier(ticketStep)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTicketStep>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTicketStep[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTicketStepIdentifier(ticketStep: Pick<ITicketStep, 'id'>): number {
    return ticketStep.id;
  }

  compareTicketStep(o1: Pick<ITicketStep, 'id'> | null, o2: Pick<ITicketStep, 'id'> | null): boolean {
    return o1 && o2 ? this.getTicketStepIdentifier(o1) === this.getTicketStepIdentifier(o2) : o1 === o2;
  }

  addTicketStepToCollectionIfMissing<Type extends Pick<ITicketStep, 'id'>>(
    ticketStepCollection: Type[],
    ...ticketStepsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ticketSteps: Type[] = ticketStepsToCheck.filter(isPresent);
    if (ticketSteps.length > 0) {
      const ticketStepCollectionIdentifiers = ticketStepCollection.map(ticketStepItem => this.getTicketStepIdentifier(ticketStepItem));
      const ticketStepsToAdd = ticketSteps.filter(ticketStepItem => {
        const ticketStepIdentifier = this.getTicketStepIdentifier(ticketStepItem);
        if (ticketStepCollectionIdentifiers.includes(ticketStepIdentifier)) {
          return false;
        }
        ticketStepCollectionIdentifiers.push(ticketStepIdentifier);
        return true;
      });
      return [...ticketStepsToAdd, ...ticketStepCollection];
    }
    return ticketStepCollection;
  }

  protected convertDateFromClient<T extends ITicketStep | NewTicketStep | PartialUpdateTicketStep>(ticketStep: T): RestOf<T> {
    return {
      ...ticketStep,
      startedAt: ticketStep.startedAt?.toJSON() ?? null,
      finishedAt: ticketStep.finishedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTicketStep: RestTicketStep): ITicketStep {
    return {
      ...restTicketStep,
      startedAt: restTicketStep.startedAt ? dayjs(restTicketStep.startedAt) : undefined,
      finishedAt: restTicketStep.finishedAt ? dayjs(restTicketStep.finishedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTicketStep>): HttpResponse<ITicketStep> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTicketStep[]>): HttpResponse<ITicketStep[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
