import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { OrdersFacade } from '../../facades/orders.facade';

import { OrderStep5 } from '../../components/order-step5/order-step5';
import { OrderStep4 } from '../../components/order-step4/order-step4';
import { OrderStep3 } from '../../components/order-step3/order-step3';
import { OrderStep2 } from '../../components/order-step2/order-step2';
import { OrderStep1 } from '../../components/order-step1/order-step1';


@Component({
  selector: 'app-order-wizard',
   imports: [
    CommonModule,
    OrderStep1,
    OrderStep2,
    OrderStep3,
    OrderStep4,
    OrderStep5
  ],
  templateUrl: './order-wizard.html',
  styleUrl: './order-wizard.scss',
})
export class OrderWizard implements OnInit {
   public facade = inject(OrdersFacade);
  private router = inject(Router);

  ngOnInit(): void {
    this.facade.startNewOrder();
  }
 
  onBack(): void {
    if (this.facade.currentStep() === 1) {
      this.facade.cancel();
    } else {
      this.facade.previousStep();
    }
  }

  getStepTitle(): string {
    const step = this.facade.currentStep();
    const titles = {
      1: 'Passo 1 de 5: Cliente',
      2: 'Passo 2 de 5: Produto',
      3: 'Passo 3 de 5: Sabores',
      4: 'Passo 4 de 5: Entrega',
      5: 'Passo 5 de 5: Resumo'
    };
    return titles[step as keyof typeof titles] || '';
  }
}
