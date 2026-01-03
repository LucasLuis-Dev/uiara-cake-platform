import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

// Facade
import { CustomersFacade } from '../../facades/customers.facade';


@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    SkeletonModule,
    IconFieldModule,
    InputIconModule,
    AvatarModule,
    TooltipModule,
    EmptyState
  ],
  templateUrl: './customers-list.html',
  styleUrls: ['./customers-list.scss']
})
export class CustomersList implements OnInit {
  searchValue: string = '';

  constructor(public facade: CustomersFacade) {
    // Effect para reagir a mudanças
    effect(() => {
      const customers = this.facade.customers();
      console.log('Customers updated:', customers.length);
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.facade.loadCustomers();
  }

  onSearch(): void {
    this.facade.setSearchQuery(this.searchValue);
  }

  onClearSearch(): void {
    this.searchValue = '';
    this.facade.clearSearch();
  }

  onRefresh(): void {
    this.facade.refresh();
  }

  onCustomerClick(id: string): void {
    this.facade.navigateToDetail(id);
  }

  onCreateCustomer(): void {
    this.facade.navigateToCreate();
  }

  getInitials(name: string): string {
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  formatPhone(phone: string): string {
    // Formatar telefone brasileiro
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }
}
