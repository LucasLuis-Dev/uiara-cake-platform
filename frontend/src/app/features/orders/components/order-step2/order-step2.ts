import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { OrdersFacade } from '../../facades/orders.facade';
import { Size, CoverageType, PRICE_TABLE } from '../../../../core/models/order.model';


@Component({
  selector: 'app-order-step2',
  imports: [CommonModule, ButtonModule],
  templateUrl: './order-step2.html',
  styleUrl: './order-step2.scss',
})
export class OrderStep2 {
  facade = inject(OrdersFacade);
  Size = Size;
  CoverageType = CoverageType;
  priceTable = PRICE_TABLE;

  onSelectCoverage(type: CoverageType): void {
    this.facade.selectCoverageType(type);
  }

  onSelectSize(size: Size): void {
    this.facade.selectSize(size);
  }

  getPrice(size: Size): number {
    const info = this.priceTable.find(p => p.size === size);
    if (!info) return 0;
    
    const coverage = this.facade.orderForm().coverageType;
    return coverage === CoverageType.CHANTILLY 
      ? info.chantillyPrice 
      : info.ganachePrice;
  }

  getSpecs(size: Size): string {
    const info = this.priceTable.find(p => p.size === size);
    if (!info) return '';
    return `${info.diameterCm}cm • ${info.weightKg}kg`;
  }
}
