import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

import { OrdersFacade } from '../../facades/orders.facade';
import { Flavor } from '../../../../core/models/flavor.model';


@Component({
  selector: 'app-order-step3',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectModule
  ],
  templateUrl: './order-step3.html',
  styleUrl: './order-step3.scss',
})
export class OrderStep3 {
  facade = inject(OrdersFacade);


  onFillingChange(event: any): void {
    const fillingId = event.value;
    console.log('Selected filling ID:', fillingId); // Debug
    this.facade.selectFilling(fillingId);
  }

  onDoughChange(event: any): void {
    const doughId = event.value;
    console.log('Selected dough ID:', doughId); // Debug
    this.facade.selectDough(doughId);
  }

  get selectedFilling(): Flavor | undefined {
    const id = this.facade.orderForm().fillingId;
    return this.facade.fillings().find(f => f.id === id);
  }

  get selectedDough(): Flavor | undefined {
    const id = this.facade.orderForm().doughId;
    return this.facade.doughs().find(d => d.id === id);
  }
}
