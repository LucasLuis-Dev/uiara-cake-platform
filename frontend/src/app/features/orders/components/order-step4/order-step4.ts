import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';

import { OrdersFacade } from '../../facades/orders.facade';

@Component({
  selector: 'app-order-step4',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DatePickerModule,
    TextareaModule
  ],
  templateUrl: './order-step4.html',
  styleUrl: './order-step4.scss',
})
export class OrderStep4 {
  public facade = inject(OrdersFacade);

  minDate: Date;
  deliveryDate: Date | null = null;
  observations: string = '';

  constructor() {
    // Mínimo 2 dias de antecedência
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 2);

    // Carregar valores do facade
    this.deliveryDate = this.facade.orderForm().deliveryDate;
    this.observations = this.facade.orderForm().observations;
  }

  onDateChange(date: Date): void {
    this.facade.setDeliveryDate(date);
  }

  onObservationsChange(): void {
    this.facade.setObservations(this.observations);
  }

}
