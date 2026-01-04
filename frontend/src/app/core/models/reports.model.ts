export interface DashboardMetrics {
  metrics: {
    totalOrders: number;
    totalRevenue: number;
    deliveriesToday: number;
    averageTicket: number;
  };
  topProducts: Array<{
    size: string;
    quantity: number;
  }>;
  topFlavors: Array<{
    flavor: string;
    quantity: number;
  }>;
  topCustomers: Array<{
    customer: {
      id: string;
      name: string;
      phone: string;
    };
    totalOrders: number;
    totalSpent: number;
  }>;
}

export interface ProductPerformance {
  bySize: {
    [key: string]: {
      quantity: number;
      revenue: number;
    };
  };
  byCoverage: {
    [key: string]: {
      quantity: number;
      revenue: number;
    };
  };
  byFilling: {
    [key: string]: {
      quantity: number;
      revenue: number;
    };
  };
}

export interface CalendarDelivery {
  date: string;
  orders: Array<{
    id: string;
    customerName: string;
    size: string;
    deliveryTime: string;
  }>;
}

export interface FinancialReport {
  period: {
    startDate: string;
    endDate: string;
  };
  revenue: {
    total: number;
    paid: number;
    pending: number;
  };
  costs: {
    total: number;
  };
  profit: {
    total: number;
    margin: number;
  };
}

export interface RevenueByPeriod {
  date: string;
  revenue: number;
  orders: number;
}

export interface UpcomingDelivery {
  id: string;
  customerName: string;
  customerPhone: string;
  size: string;
  deliveryDate: string;
  totalValue: number;
  status: string;
}

export enum ReportPeriod {
  THIS_MONTH = 'THIS_MONTH',
  LAST_MONTH = 'LAST_MONTH',
  LAST_3_MONTHS = 'LAST_3_MONTHS',
  LAST_6_MONTHS = 'LAST_6_MONTHS',
  THIS_YEAR = 'THIS_YEAR',
  CUSTOM = 'CUSTOM'
}
