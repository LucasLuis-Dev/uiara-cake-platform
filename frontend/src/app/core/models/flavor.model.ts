export enum FlavorType {
  FILLING = 'FILLING',
  DOUGH = 'DOUGH'
}

export interface Flavor {
  id: string;
  name: string;
  type: FlavorType;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
