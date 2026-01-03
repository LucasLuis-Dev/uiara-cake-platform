import { Component, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';

import { MetricCard } from '../../components/metric-card/metric-card';

import { DashboardFacade } from '../../facades/dashboard.facade';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    ProgressSpinnerModule,
    MetricCard,
    SkeletonModule,
    EmptyState
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  currentDate = new Date();
  public facade = inject(DashboardFacade);

  private dataEffect = effect(() => {
    const data = this.facade.dashboardData();
    if (data) {
      console.log('Dashboard data updated:', data);
    }
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.facade.loadDashboard();
    this.facade.loadUpcomingDeliveries();
  }

  onRefresh(): void {
    this.facade.refresh();
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  formatDate(): string {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(this.currentDate);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING': 'Pendente',
      'CONFIRMED': 'Confirmado',
      'IN_PRODUCTION': 'Em Produção',
      'READY': 'Pronto',
      'DELIVERED': 'Entregue',
      'CANCELLED': 'Cancelado'
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    const severityMap = {
      'PENDING': 'warn',
      'CONFIRMED': 'info',
      'IN_PRODUCTION': 'info',
      'READY': 'success',
      'DELIVERED': 'success',
      'CANCELLED': 'danger'
    } as const;
    
    return severityMap[status as keyof typeof severityMap] || 'info';
  }

}
