import { Injectable, signal, computed } from '@angular/core';
import { DashboardService, DashboardData } from '../services/dashboard.service';
import { Order } from '../../../core/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardFacade {
  // Signals
  private loadingSignal = signal<boolean>(false);
  private dashboardDataSignal = signal<DashboardData | null>(null);
  private upcomingDeliveriesSignal = signal<Order[]>([]);

  // Computed - derived state
  readonly loading = this.loadingSignal.asReadonly();
  readonly dashboardData = this.dashboardDataSignal.asReadonly();
  readonly upcomingDeliveries = this.upcomingDeliveriesSignal.asReadonly();

  // Computed properties
  readonly hasDeliveries = computed(() => 
    this.upcomingDeliveriesSignal().length > 0
  );

  readonly totalRevenue = computed(() => 
    this.dashboardDataSignal()?.metrics.totalRevenue ?? 0
  );

  readonly deliveriesToday = computed(() => 
    this.dashboardDataSignal()?.metrics.deliveriesToday ?? 0
  );

  constructor(private dashboardService: DashboardService) {}

  loadDashboard(startDate?: string, endDate?: string): void {
    this.loadingSignal.set(true);

    this.dashboardService.getDashboard(startDate, endDate).subscribe({
      next: (data: DashboardData) => {
        this.dashboardDataSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: (error: Error) => {
        console.error('Error loading dashboard:', error);
        this.loadingSignal.set(false);
      }
    });
  }

  loadUpcomingDeliveries(days: number = 7): void {
    this.dashboardService.getUpcomingDeliveries(days).subscribe({
      next: (deliveries: Order[]) => {
        this.upcomingDeliveriesSignal.set(deliveries);
      },
      error: (error: Error) => {
        console.error('Error loading deliveries:', error);
      }
    });
  }

  refresh(): void {
    this.loadDashboard();
    this.loadUpcomingDeliveries();
  }
}
