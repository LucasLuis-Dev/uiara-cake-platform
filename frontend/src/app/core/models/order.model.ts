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
  customer: any;
  fillingId: string;
  filling: any;
  doughId: string;
  dough: any;
  size: Size;
  coverageType: CoverageType;
  orderDate: Date | string;
  deliveryDate: Date | string;
  totalValue: number;
  status: OrderStatus;
  observations?: string;
  googleCalendarEventId?: string;
  downPaymentPaid?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
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

export interface PriceInfo {
  size: Size;
  diameterCm: number;
  weightKg: number;
  chantillyPrice: number;
  ganachePrice: number;
}

export const PRICE_TABLE: PriceInfo[] = [
  { size: Size.PP, diameterCm: 14, weightKg: 1, chantillyPrice: 140, ganachePrice: 170 },
  { size: Size.P, diameterCm: 16, weightKg: 1.5, chantillyPrice: 195, ganachePrice: 195 },
  { size: Size.M, diameterCm: 18, weightKg: 2, chantillyPrice: 275, ganachePrice: 340 },
  { size: Size.G, diameterCm: 20, weightKg: 3, chantillyPrice: 355, ganachePrice: 510 },
  { size: Size.GG, diameterCm: 22, weightKg: 4, chantillyPrice: 470, ganachePrice: 470 },
];
