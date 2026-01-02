export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  deliveriesToday: number;
  averageTicket: number;
}

export interface ProductSales {
  size: string;
  quantity: number;
}

export interface FlavorStats {
  flavor: string;
  quantity: number;
}

export interface TopCustomer {
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  totalOrders: number;
  totalSpent: number;
}

export interface DashboardResponse {
  metrics: DashboardMetrics;
  topProducts: ProductSales[];
  topFlavors: FlavorStats[];
  topCustomers: TopCustomer[];
}

export interface CalendarResponse {
  month: number;
  year: number;
  orders: Record<number, any[]>;
}

export interface FinancialReport {
  period: {
    startDate: Date;
    endDate: Date;
  };
  financial: {
    totalSold: number;
    totalOrders: number;
    averageTicket: number;
  };
  ordersByStatus: Record<string, number>;
  ordersByMonth: Record<string, { count: number; revenue: number }>;
}

export interface RevenueByPeriod {
  date: string;
  revenue: number;
}

export interface ProductPerformance {
  bySize: Record<string, { quantity: number; revenue: number }>;
  byCoverage: Record<string, { quantity: number; revenue: number }>;
  byFilling: Record<string, { quantity: number; revenue: number }>;
}
