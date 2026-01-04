import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AvatarModule } from 'primeng/avatar';

import { OrdersFacade } from '../../facades/orders.facade';
import { Customer, CustomerCreateDto } from '../../../../core/models/customer.model';
import { CustomerFormModal } from '../../../../shared/components/customer-form-modal/customer-form-modal';
import { CustomersFacade } from '../../../customers/facades/customers.facade';

@Component({
  selector: 'app-order-step1',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    AvatarModule,
    CustomerFormModal
  ],
  templateUrl: './order-step1.html',
  styleUrl: './order-step1.scss',
})
export class OrderStep1 {
  facade = inject(OrdersFacade);
  customersFacade = inject(CustomersFacade);

  searchQuery = '';
  showModal = false;

  get filteredCustomers(): Customer[] {
    if (!this.searchQuery) return this.facade.customers();
    
    const query = this.searchQuery.toLowerCase();
    return this.facade.customers().filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.phone.includes(query)
    );
  }

  onSelectCustomer(customer: Customer): void {
    this.facade.selectCustomer(customer);
  }

  onNewCustomer(): void {
    this.showModal = true;
  }

  onCloseModal(): void {
    this.showModal = false;
  }

  onSubmitCustomer(data: CustomerCreateDto): void {
    this.customersFacade.createCustomerFromModal(data);
    setTimeout(() => {
      this.facade.loadCustomers();
      this.showModal = false;
    }, 500);
  }

  getInitials(name: string): string {
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }
}
