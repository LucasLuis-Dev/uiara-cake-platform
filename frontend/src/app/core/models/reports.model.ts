import { Size, CoverageType } from './order.model';

export interface ReportsMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  receivable: number; // A receber (50% restante)
}

export interface SizeDistribution {
  size: Size;
  count: number;
  percentage: number;
}

export interface FlavorRanking {
  id: string;
  name: string;
  count: number;
  revenue: number;
}

export interface CustomerRanking {
  id: string;
  name: string;
  orderCount: number;
  totalSpent: number;
}

export interface ReportsPeriod {
  startDate: Date;
  endDate: Date;
}

export enum ReportsPeriodType {
  THIS_MONTH = 'THIS_MONTH',
  LAST_MONTH = 'LAST_MONTH',
  THIS_YEAR = 'THIS_YEAR',
  CUSTOM = 'CUSTOM'
}

export interface ReportsData {
  metrics: ReportsMetrics;
  sizeDistribution: SizeDistribution[];
  topFlavors: FlavorRanking[];
  topCustomers: CustomerRanking[];
  period: ReportsPeriod;
}
