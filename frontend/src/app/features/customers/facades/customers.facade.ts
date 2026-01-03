import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CustomersService } from '../services/customers.service';
import { Customer, CustomerCreateDto, CustomerUpdateDto } from '../../../core/models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersFacade {
  // Private signals
  private loadingSignal = signal<boolean>(false);
  private customersSignal = signal<Customer[]>([]);
  private selectedCustomerSignal = signal<Customer | null>(null);
  private searchQuerySignal = signal<string>('');
  private errorSignal = signal<string | null>(null);

  // Public readonly signals
  readonly loading = this.loadingSignal.asReadonly();
  readonly customers = this.customersSignal.asReadonly();
  readonly selectedCustomer = this.selectedCustomerSignal.asReadonly();
  readonly searchQuery = this.searchQuerySignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  // Computed signals
  readonly filteredCustomers = computed(() => {
    const query = this.searchQuerySignal().toLowerCase().trim();
    if (!query) return this.customersSignal();
    
    return this.customersSignal().filter(customer =>
      customer.name.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      (customer.whatsapp && customer.whatsapp.includes(query))
    );
  });

  readonly hasCustomers = computed(() => this.customersSignal().length > 0);
  readonly hasFilteredResults = computed(() => this.filteredCustomers().length > 0);
  readonly customersCount = computed(() => this.customersSignal().length);
  readonly filteredCount = computed(() => this.filteredCustomers().length);

  constructor(
    private customersService: CustomersService,
    private router: Router
  ) {}

  /**
   * Carregar todos os clientes
   */
  loadCustomers(search?: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.customersService.getAll(search).subscribe({
      next: (customers: Customer[]) => {
        this.customersSignal.set(customers);
        this.loadingSignal.set(false);
      },
      error: (error: Error) => {
        console.error('Error loading customers:', error);
        this.errorSignal.set('Erro ao carregar clientes');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Carregar cliente específico por ID
   */
  loadCustomer(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.customersService.getById(id).subscribe({
      next: (customer: Customer) => {
        this.selectedCustomerSignal.set(customer);
        this.loadingSignal.set(false);
      },
      error: (error: Error) => {
        console.error('Error loading customer:', error);
        this.errorSignal.set('Erro ao carregar cliente');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Criar novo cliente
   */
  createCustomer(data: CustomerCreateDto): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.customersService.create(data).subscribe({
      next: (customer: Customer) => {
        // Adicionar à lista existente
        this.customersSignal.update(customers => [...customers, customer]);
        this.loadingSignal.set(false);
        // Navegar para lista
        this.router.navigate(['/admin/customers']);
      },
      error: (error: Error) => {
        console.error('Error creating customer:', error);
        this.errorSignal.set('Erro ao criar cliente');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Atualizar cliente existente
   */
  updateCustomer(id: string, data: CustomerUpdateDto): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.customersService.update(id, data).subscribe({
      next: (updatedCustomer: Customer) => {
        // Atualizar na lista
        this.customersSignal.update(customers =>
          customers.map(c => c.id === id ? updatedCustomer : c)
        );
        // Atualizar selecionado
        if (this.selectedCustomerSignal()?.id === id) {
          this.selectedCustomerSignal.set(updatedCustomer);
        }
        this.loadingSignal.set(false);
        // Navegar para lista
        this.router.navigate(['/admin/customers']);
      },
      error: (error: Error) => {
        console.error('Error updating customer:', error);
        this.errorSignal.set('Erro ao atualizar cliente');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletar cliente
   */
  deleteCustomer(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.customersService.delete(id).subscribe({
      next: () => {
        // Remover da lista
        this.customersSignal.update(customers =>
          customers.filter(c => c.id !== id)
        );
        this.loadingSignal.set(false);
      },
      error: (error: Error) => {
        console.error('Error deleting customer:', error);
        this.errorSignal.set('Erro ao deletar cliente');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Atualizar query de busca (busca local)
   */
  setSearchQuery(query: string): void {
    this.searchQuerySignal.set(query);
  }

  /**
   * Limpar busca
   */
  clearSearch(): void {
    this.searchQuerySignal.set('');
  }

  /**
   * Limpar cliente selecionado
   */
  clearSelectedCustomer(): void {
    this.selectedCustomerSignal.set(null);
  }

  /**
   * Limpar erro
   */
  clearError(): void {
    this.errorSignal.set(null);
  }

  /**
   * Recarregar lista
   */
  refresh(): void {
    this.loadCustomers(this.searchQuerySignal());
  }

  /**
   * Navegar para criar novo cliente
   */
  navigateToCreate(): void {
    this.router.navigate(['/admin/customers/new']);
  }

  /**
   * Navegar para editar cliente
   */
  navigateToEdit(id: string): void {
    this.router.navigate(['/admin/customers/edit', id]);
  }

  /**
   * Navegar para detalhes do cliente
   */
  navigateToDetail(id: string): void {
    this.router.navigate(['/admin/customers', id]);
  }
}
