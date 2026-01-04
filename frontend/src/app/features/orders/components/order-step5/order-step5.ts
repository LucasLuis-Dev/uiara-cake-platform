import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

import { OrdersFacade } from '../../facades/orders.facade';
import { CoverageType, Size } from '../../../../core/models/order.model';

@Component({
  selector: 'app-order-step5',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
  ],
  templateUrl: './order-step5.html',
  styleUrl: './order-step5.scss',
})
export class OrderStep5 {
  public facade = inject(OrdersFacade);


  getCoverageLabel(type: CoverageType): string {
    return type === CoverageType.CHANTILLY ? 'Chantilly' : 'Ganache';
  }

  getFillingName(): string {
    const id = this.facade.orderForm().fillingId;
    return this.facade.fillings().find(f => f.id === id)?.name || '-';
  }

  getDoughName(): string {
    const id = this.facade.orderForm().doughId;
    return this.facade.doughs().find(d => d.id === id)?.name || '-';
  }

  formatDate(date: Date | null): string {
    if (!date) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  }

  onConfirm(): void {
    this.facade.submitOrder();
  }

}
