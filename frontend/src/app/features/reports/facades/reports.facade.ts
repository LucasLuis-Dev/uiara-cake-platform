import { Injectable, signal, computed } from '@angular/core';
import { ReportsService } from '../services/reports.service';
import {
  DashboardMetrics,
  ProductPerformance,
  ReportPeriod
} from '../../../core/models/reports.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsFacade {
  // Signals
  private dashboardSignal = signal<DashboardMetrics | null>(null);
  private productPerformanceSignal = signal<ProductPerformance | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private selectedPeriodSignal = signal<ReportPeriod>(ReportPeriod.THIS_MONTH);

  // Readonly signals
  readonly dashboard = this.dashboardSignal.asReadonly();
  readonly productPerformance = this.productPerformanceSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly selectedPeriod = this.selectedPeriodSignal.asReadonly();

  // Computed
  readonly hasData = computed(() => this.dashboardSignal() !== null);

  constructor(private reportsService: ReportsService) {}

  /**
   * Carregar dados do dashboard
   */
  loadDashboard(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const { startDate, endDate } = this.getPeriodDates();

    this.reportsService.getDashboard(startDate, endDate).subscribe({
      next: (data: DashboardMetrics) => {
        this.dashboardSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: (error: Error) => {
        console.error('Error loading dashboard:', error);
        this.errorSignal.set('Erro ao carregar dashboard');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Carregar performance de produtos
   */
  loadProductPerformance(): void {
    this.reportsService.getProductPerformance().subscribe({
      next: (data: ProductPerformance) => {
        this.productPerformanceSignal.set(data);
      },
      error: (error: Error) => {
        console.error('Error loading product performance:', error);
      }
    });
  }

  /**
   * Alterar período
   */
  setPeriod(period: ReportPeriod): void {
    this.selectedPeriodSignal.set(period);
    this.loadDashboard();
    this.loadProductPerformance();
  }

  /**
   * Obter datas do período selecionado
   */
  private getPeriodDates(): { startDate: string; endDate: string } {
    const now = new Date();
    const endDate = now.toISOString();
    let startDate: Date;

    switch (this.selectedPeriodSignal()) {
      case ReportPeriod.THIS_MONTH:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case ReportPeriod.LAST_MONTH:
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case ReportPeriod.LAST_3_MONTHS:
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case ReportPeriod.LAST_6_MONTHS:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case ReportPeriod.THIS_YEAR:
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return {
      startDate: startDate.toISOString(),
      endDate: endDate
    };
  }

  /**
   * Refresh
   */
  refresh(): void {
    this.loadDashboard();
    this.loadProductPerformance();
  }
}
