import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api/api.service';
import {
  DashboardMetrics,
  CalendarDelivery,
  FinancialReport,
  RevenueByPeriod,
  ProductPerformance,
  UpcomingDelivery
} from '../../../core/models/reports.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  apiService = inject(ApiService);

  /**
   * Buscar métricas do dashboard
   */
  getDashboard(startDate?: string, endDate?: string): Observable<DashboardMetrics> {
    const params: Record<string, string> = {};
    if (startDate) params['startDate'] = startDate;
    if (endDate) params['endDate'] = endDate;
    return this.apiService.get<DashboardMetrics>('reports/dashboard', params);
  }

  /**
   * Buscar calendário de entregas
   */
  getCalendar(year: number, month: number): Observable<CalendarDelivery[]> {
    return this.apiService.get<CalendarDelivery[]>('reports/calendar', {
      year: year.toString(),
      month: month.toString()
    });
  }

  /**
   * Buscar relatório financeiro
   */
  getFinancialReport(startDate?: string, endDate?: string): Observable<FinancialReport> {
    const params: Record<string, string> = {};
    if (startDate) params['startDate'] = startDate;
    if (endDate) params['endDate'] = endDate;
    return this.apiService.get<FinancialReport>('reports/financial', params);
  }

  /**
   * Buscar receita por período
   */
  getRevenueByPeriod(startDate?: string, endDate?: string): Observable<RevenueByPeriod[]> {
    const params: Record<string, string> = {};
    if (startDate) params['startDate'] = startDate;
    if (endDate) params['endDate'] = endDate;
    return this.apiService.get<RevenueByPeriod[]>('reports/revenue', params);
  }

  /**
   * Buscar performance de produtos
   */
  getProductPerformance(): Observable<ProductPerformance> {
    return this.apiService.get<ProductPerformance>('reports/product-performance');
  }

  /**
   * Buscar próximas entregas
   */
  getUpcomingDeliveries(days: number = 7): Observable<UpcomingDelivery[]> {
    return this.apiService.get<UpcomingDelivery[]>('reports/upcoming-deliveries', {
      days: days.toString()
    });
  }
}
