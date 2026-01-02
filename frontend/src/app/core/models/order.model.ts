import { Flavor } from "./flavor.model";
import { Customer } from "./customer.model";

export enum Size {
  PP = 'PP',
  P = 'P',
  M = 'M',
  G = 'G',
  GG = 'GG'
}

export enum CoverageType {
  CHANTILLY = 'CHANTILLY',
  GANACHE = 'GANACHE'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: string;
  customerId: string;
  customer: Customer;
  fillingId: string;
  filling: Flavor;
  doughId: string;
  dough: Flavor;
  size: Size;
  coverageType: CoverageType;
  orderDate: Date;
  deliveryDate: Date;
  totalValue: number;
  status: OrderStatus;
  observations?: string;
  googleCalendarEventId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderCreateDto {
  customerId: string;
  size: Size;
  coverageType: CoverageType;
  fillingId: string;
  doughId: string;
  deliveryDate: string;
  observations?: string;
}
