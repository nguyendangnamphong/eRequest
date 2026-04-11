import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '14c1ba57-2cdb-45db-b5f5-a520e840c10f',
};

export const sampleWithPartialData: IAuthority = {
  name: 'efd39e97-7714-4b5c-957a-e8890cd7ba85',
};

export const sampleWithFullData: IAuthority = {
  name: 'ce297f76-610c-43bc-8b73-ddea46d4cc24',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
