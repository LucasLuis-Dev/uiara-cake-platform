import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';

// Facade
import { ReportsFacade } from '../../facades/reports.facade';
import { ReportPeriod } from '../../../../core/models/reports.model';
import { MetricCard } from '../../../../shared/components/metric-card/metric-card';

interface PeriodOption {
  label: string;
  value: ReportPeriod;
}

@Component({
  selector: 'app-reports-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    SelectModule,
    SkeletonModule,
    ChartModule,
    ButtonModule,
    MetricCard
  ],
  templateUrl: './reports-dashboard.html',
  styleUrl: './reports-dashboard.scss',
})
export class ReportsDashboard implements OnInit {
  public facade = inject(ReportsFacade);

  periodOptions: PeriodOption[] = [
    { label: 'Este mês', value: ReportPeriod.THIS_MONTH },
    { label: 'Mês passado', value: ReportPeriod.LAST_MONTH },
    { label: 'Últimos 3 meses', value: ReportPeriod.LAST_3_MONTHS },
    { label: 'Últimos 6 meses', value: ReportPeriod.LAST_6_MONTHS },
    { label: 'Este ano', value: ReportPeriod.THIS_YEAR }
  ];

  selectedPeriod: ReportPeriod = ReportPeriod.THIS_MONTH;

  // Chart data
  sizeChartData: any;
  sizeChartOptions: any;

  // Effect para atualizar gráfico quando dados mudarem
  private performanceEffect = effect(() => {
    const performance = this.facade.productPerformance();
    if (performance) {
      this.updateChartData();
    }
  });

  ngOnInit(): void {
    this.loadData();
    this.initChartOptions();
  }

  loadData(): void {
    this.facade.loadDashboard();
    this.facade.loadProductPerformance();
  }

  onPeriodChange(period: ReportPeriod): void {
    this.facade.setPeriod(period);
  }

  onRefresh(): void {
    this.facade.refresh();
  }

  private initChartOptions(): void {
    this.sizeChartOptions = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    };
  }

  private updateChartData(): void {
    const performance = this.facade.productPerformance();
    if (!performance || !performance.bySize) {
      this.sizeChartData = null;
      return;
    }

    // Converter objeto para array e ordenar
    const sizes = Object.entries(performance.bySize)
      .map(([size, data]) => ({
        size,
        quantity: data.quantity,
        revenue: data.revenue
      }))
      .sort((a, b) => b.quantity - a.quantity);

    this.sizeChartData = {
      labels: sizes.map(s => s.size),
      datasets: [
        {
          data: sizes.map(s => s.quantity),
          backgroundColor: '#ff8b77',
          borderRadius: 10
        }
      ]
    };
  }

  get topFillings(): Array<{ name: string; count: number }> {
    const dashboard = this.facade.dashboard();
    if (!dashboard || !dashboard.topFlavors?.length) {
      return [];
    }
    return dashboard.topFlavors
      .slice(0, 5)
      .map(f => ({
        name: f.flavor,
        count: f.quantity
      }));
  }

  get topCustomers(): Array<{ name: string; orders: number; spent: number }> {
    const dashboard = this.facade.dashboard();
    if (!dashboard || !dashboard.topCustomers?.length) {
      return [];
    }
    return dashboard.topCustomers
      .slice(0, 5)
      .map(c => ({
        name: c.customer.name,
        orders: c.totalOrders,
        spent: c.totalSpent
      }));
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  get sizeChartDataFormatted(): any {
    return this.sizeChartData;
  }
}
