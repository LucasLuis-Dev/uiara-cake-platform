import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  DashboardResponse,
  CalendarResponse,
  FinancialReport,
  RevenueByPeriod,
  ProductPerformance,
  FlavorStats,
  TopCustomer,
  ProductSales,
} from './interfaces/report-response.interface';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(startDate?: Date, endDate?: Date): Promise<DashboardResponse> {
    const today = new Date();
    const start = startDate || new Date(today.getFullYear(), today.getMonth(), 1);
    const end = endDate || new Date();

    // Get orders within period
    const orders = await this.prisma.order.findMany({
      where: {
        orderDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        filling: true,
        dough: true,
        customer: true,
      },
    });

    // Calculate general metrics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (acc, order) => acc + Number(order.totalValue),
      0,
    );
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Deliveries today
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const deliveriesToday = await this.prisma.order.count({
      where: {
        deliveryDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: 'DELIVERED',
        },
      },
    });

    // Top products by size
    const productsBySize = orders.reduce((acc: any, order) => {
      acc[order.size] = (acc[order.size] || 0) + 1;
      return acc;
    }, {});

    const topProducts: ProductSales[] = Object.entries(productsBySize)
      .map(([size, quantity]) => ({ size, quantity: quantity as number }))
      .sort((a, b) => b.quantity - a.quantity);

    // Top flavors (fillings)
    const flavorsByFilling = orders.reduce((acc: any, order) => {
      const name = order.filling.name;
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    const topFlavors: FlavorStats[] = Object.entries(flavorsByFilling)
      .map(([flavor, quantity]) => ({ flavor, quantity: quantity as number }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Top customers
    const customersMap = orders.reduce((acc: any, order) => {
      const customerId = order.customerId;
      if (!acc[customerId]) {
        acc[customerId] = {
          customer: order.customer,
          totalOrders: 0,
          totalSpent: 0,
        };
      }
      acc[customerId].totalOrders += 1;
      acc[customerId].totalSpent += Number(order.totalValue);
      return acc;
    }, {});

    const topCustomers: TopCustomer[] = Object.values(customersMap)
      .sort((a: any, b: any) => b.totalSpent - a.totalSpent)
      .slice(0, 5)
      .map((item: any) => ({
        customer: {
          id: item.customer.id,
          name: item.customer.name,
          phone: item.customer.phone,
        },
        totalOrders: item.totalOrders,
        totalSpent: item.totalSpent,
      }));

    return {
      metrics: {
        totalOrders,
        totalRevenue,
        deliveriesToday,
        averageTicket,
      },
      topProducts,
      topFlavors,
      topCustomers,
    };
  }

  async getCalendar(month?: number, year?: number): Promise<CalendarResponse> {
    const today = new Date();
    const targetMonth = month !== undefined ? month : today.getMonth();
    const targetYear = year !== undefined ? year : today.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const orders = await this.prisma.order.findMany({
      where: {
        deliveryDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
        filling: true,
        dough: true,
      },
      orderBy: { deliveryDate: 'asc' },
    });

    // Group by day
    const ordersByDay = orders.reduce((acc: any, order) => {
      const day = new Date(order.deliveryDate).getDate();
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(order);
      return acc;
    }, {});

    return {
      month: targetMonth,
      year: targetYear,
      orders: ordersByDay,
    };
  }

  async getFinancialReport(startDate?: Date, endDate?: Date): Promise<FinancialReport> {
    const today = new Date();
    const start = startDate || new Date(today.getFullYear(), 0, 1);
    const end = endDate || today;

    const orders = await this.prisma.order.findMany({
      where: {
        orderDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        customer: true,
      },
    });

    const totalSold = orders.reduce(
      (acc, order) => acc + Number(order.totalValue),
      0,
    );

    // Group by status
    const ordersByStatus = orders.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Group by month
    const ordersByMonth = orders.reduce((acc: any, order) => {
      const monthYear = new Date(order.orderDate).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'short',
      });
      if (!acc[monthYear]) {
        acc[monthYear] = {
          count: 0,
          revenue: 0,
        };
      }
      acc[monthYear].count += 1;
      acc[monthYear].revenue += Number(order.totalValue);
      return acc;
    }, {});

    return {
      period: {
        startDate: start,
        endDate: end,
      },
      financial: {
        totalSold,
        totalOrders: orders.length,
        averageTicket: orders.length > 0 ? totalSold / orders.length : 0,
      },
      ordersByStatus,
      ordersByMonth,
    };
  }

    async getRevenueByPeriod(startDate: Date, endDate: Date): Promise<RevenueByPeriod[]> {
        const orders = await this.prisma.order.findMany({
            where: {
                orderDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                totalValue: true,
                orderDate: true,
            },
        });

        const dailyRevenue: Record<string, number> = orders.reduce((acc, order) => {
            const date = new Date(order.orderDate).toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += Number(order.totalValue);
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(dailyRevenue)
            .map(([date, revenue]) => ({ date, revenue }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

  async getProductPerformance(): Promise<ProductPerformance> {
    const orders = await this.prisma.order.findMany({
      include: {
        filling: true,
      },
    });

    // Performance by size
    const performanceBySize = orders.reduce((acc: any, order) => {
      const size = order.size;
      if (!acc[size]) {
        acc[size] = {
          quantity: 0,
          revenue: 0,
        };
      }
      acc[size].quantity += 1;
      acc[size].revenue += Number(order.totalValue);
      return acc;
    }, {});

    // Performance by coverage type
    const performanceByCoverage = orders.reduce((acc: any, order) => {
      const coverage = order.coverageType;
      if (!acc[coverage]) {
        acc[coverage] = {
          quantity: 0,
          revenue: 0,
        };
      }
      acc[coverage].quantity += 1;
      acc[coverage].revenue += Number(order.totalValue);
      return acc;
    }, {});

    // Performance by filling
    const performanceByFilling = orders.reduce((acc: any, order) => {
      const filling = order.filling.name;
      if (!acc[filling]) {
        acc[filling] = {
          quantity: 0,
          revenue: 0,
        };
      }
      acc[filling].quantity += 1;
      acc[filling].revenue += Number(order.totalValue);
      return acc;
    }, {});

    return {
      bySize: performanceBySize,
      byCoverage: performanceByCoverage,
      byFilling: performanceByFilling,
    };
  }

  async getUpcomingDeliveries(days: number = 7) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + days);
    endDate.setHours(23, 59, 59, 999);

    return this.prisma.order.findMany({
      where: {
        deliveryDate: {
          gte: today,
          lte: endDate,
        },
        status: {
          in: ['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY'],
        },
      },
      include: {
        customer: true,
        filling: true,
        dough: true,
      },
      orderBy: { deliveryDate: 'asc' },
    });
  }
}
