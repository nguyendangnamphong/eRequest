import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 12149,
  login: 'it2pIS',
};

export const sampleWithPartialData: IUser = {
  id: 21179,
  login: '7Wd-',
};

export const sampleWithFullData: IUser = {
  id: 5589,
  login: 'DI@UuXL\\7mJr\\Lkl3R',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
