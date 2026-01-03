import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api/api.service';
import { Order } from '../../../core/models/order.model';

export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  deliveriesToday: number;
  averageTicket: number;
}

export interface TopProduct {
  size: string;
  quantity: number;
}

export interface TopFlavor {
  flavor: string;
  quantity: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  totalOrders: number;
  totalRevenue: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  topProducts: TopProduct[];
  topFlavors: TopFlavor[];
  topCustomers: TopCustomer[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiService = inject(ApiService);

  getDashboard(startDate?: string, endDate?: string): Observable<DashboardData> {
    const params: Record<string, string> = {};
    if (startDate) params['startDate'] = startDate;
    if (endDate) params['endDate'] = endDate;
    
    return this.apiService.get<DashboardData>('reports/dashboard', params);
  }

  getUpcomingDeliveries(days: number = 7): Observable<Order[]> {
    return this.apiService.get<Order[]>('reports/upcoming-deliveries', { days: days.toString() });
  }
}
