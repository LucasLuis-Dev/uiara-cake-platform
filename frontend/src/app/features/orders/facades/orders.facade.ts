import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from '../services/orders.service';
import { CustomersService } from '../../customers/services/customers.service';
import { 
  Order, 
  OrderCreateDto, 
  Size, 
  CoverageType,
  PRICE_TABLE,
  PriceInfo
} from '../../../core/models/order.model';
import { Customer } from '../../../core/models/customer.model';
import { Flavor } from '../../../core/models/flavor.model';

export interface OrderForm {
  // Step 1: Cliente
  customerId: string | null;
  customer: Customer | null;
  
  // Step 2: Produto
  size: Size | null;
  coverageType: CoverageType;
  
  // Step 3: Sabores
  fillingId: string | null;
  doughId: string | null;
  
  // Step 4: Entrega
  deliveryDate: Date | null;
  observations: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersFacade {
  // Signals
  private loadingSignal = signal<boolean>(false);
  private currentStepSignal = signal<number>(1);
  private ordersSignal = signal<Order[]>([]);
  private fillingsSignal = signal<Flavor[]>([]);
  private doughsSignal = signal<Flavor[]>([]);
  private customersSignal = signal<Customer[]>([]);
  private errorSignal = signal<string | null>(null);
  private successSignal = signal<string | null>(null);
  
  // Order Form
  private orderFormSignal = signal<OrderForm>({
    customerId: null,
    customer: null,
    size: null,
    coverageType: CoverageType.GANACHE,
    fillingId: null,
    doughId: null,
    deliveryDate: null,
    observations: '',
  });

  // Public readonly
  readonly loading = this.loadingSignal.asReadonly();
  readonly currentStep = this.currentStepSignal.asReadonly();
  readonly orders = this.ordersSignal.asReadonly();
  readonly fillings = this.fillingsSignal.asReadonly();
  readonly doughs = this.doughsSignal.asReadonly();
  readonly customers = this.customersSignal.asReadonly();
  readonly orderForm = this.orderFormSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly success = this.successSignal.asReadonly();

  // Computed
  readonly canProceedStep1 = computed(() => 
    this.orderFormSignal().customerId !== null
  );

  readonly canProceedStep2 = computed(() => 
    this.orderFormSignal().size !== null
  );

  readonly canProceedStep3 = computed(() => 
    this.orderFormSignal().fillingId !== null && 
    this.orderFormSignal().doughId !== null
  );

  readonly canProceedStep4 = computed(() => 
    this.orderFormSignal().deliveryDate !== null
  );

  readonly totalPrice = computed(() => {
    const form = this.orderFormSignal();
    if (!form.size) return 0;

    const priceInfo = PRICE_TABLE.find(p => p.size === form.size);
    if (!priceInfo) return 0;

    return form.coverageType === CoverageType.CHANTILLY 
      ? priceInfo.chantillyPrice 
      : priceInfo.ganachePrice;
  });

  readonly downPayment = computed(() => this.totalPrice() * 0.5);
  readonly remainingPayment = computed(() => this.totalPrice() * 0.5);

  readonly priceInfo = computed((): PriceInfo | null => {
    const size = this.orderFormSignal().size;
    if (!size) return null;
    return PRICE_TABLE.find(p => p.size === size) || null;
  });

  constructor(
    private ordersService: OrdersService,
    private customersService: CustomersService,
    private router: Router
  ) {}

  // ==================== NAVIGATION ====================

  startNewOrder(): void {
    this.resetForm();
    this.currentStepSignal.set(1);
    this.loadCustomers();
    this.loadFillings();
    this.loadDoughs();
  }

  nextStep(): void {
    const current = this.currentStepSignal();
    if (current < 5) {
      this.currentStepSignal.set(current + 1);
    }
  }

  previousStep(): void {
    const current = this.currentStepSignal();
    if (current > 1) {
      this.currentStepSignal.set(current - 1);
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= 5) {
      this.currentStepSignal.set(step);
    }
  }

  // ==================== FORM UPDATES ====================

  selectCustomer(customer: Customer): void {
    this.orderFormSignal.update(form => ({
      ...form,
      customerId: customer.id,
      customer: customer
    }));
    this.successSignal.set(`Cliente ${customer.name} selecionado!`);
    setTimeout(() => this.successSignal.set(null), 2000);
  }

  selectSize(size: Size): void {
    this.orderFormSignal.update(form => ({
      ...form,
      size: size
    }));
  }

  selectCoverageType(type: CoverageType): void {
    this.orderFormSignal.update(form => ({
      ...form,
      coverageType: type
    }));
  }

  selectFilling(fillingId: string): void {
    this.orderFormSignal.update(form => ({
      ...form,
      fillingId: fillingId
    }));
  }

  selectDough(doughId: string): void {
    this.orderFormSignal.update(form => ({
      ...form,
      doughId: doughId
    }));
  }

  setDeliveryDate(date: Date): void {
    this.orderFormSignal.update(form => ({
      ...form,
      deliveryDate: date
    }));
  }

  setObservations(observations: string): void {
    this.orderFormSignal.update(form => ({
      ...form,
      observations: observations
    }));
  }

  // ==================== DATA LOADING ====================

  loadCustomers(): void {
    this.customersService.getAll().subscribe({
      next: (customers: Customer[]) => {
        this.customersSignal.set(customers);
      },
      error: (error: Error) => {
        console.error('Error loading customers:', error);
        this.errorSignal.set('Erro ao carregar clientes');
      }
    });
  }

  loadFillings(): void {
    this.ordersService.getFillings().subscribe({
      next: (fillings: Flavor[]) => {
        this.fillingsSignal.set(fillings);
      },
      error: (error: Error) => {
        console.error('Error loading fillings:', error);
        this.errorSignal.set('Erro ao carregar recheios');
      }
    });
  }

  loadDoughs(): void {
    this.ordersService.getDoughs().subscribe({
      next: (doughs: Flavor[]) => {
        this.doughsSignal.set(doughs);
      },
      error: (error: Error) => {
        console.error('Error loading doughs:', error);
        this.errorSignal.set('Erro ao carregar massas');
      }
    });
  }

  // ==================== SUBMIT ORDER ====================

  submitOrder(): void {
    const form = this.orderFormSignal();

    if (!form.customerId || !form.size || !form.fillingId || !form.doughId || !form.deliveryDate) {
      this.errorSignal.set('Preencha todos os campos obrigatórios');
      return;
    }

    const orderData: OrderCreateDto = {
      customerId: form.customerId,
      size: form.size,
      coverageType: form.coverageType,
      fillingId: form.fillingId, // Garantir que é string UUID
      doughId: form.doughId, // Garantir que é string UUID
      deliveryDate: form.deliveryDate.toISOString(),
      observations: form.observations || undefined
    };

    console.log('Sending order data:', orderData); // Debug

    this.loadingSignal.set(true);

    this.ordersService.create(orderData).subscribe({
      next: (order: Order) => {
        this.loadingSignal.set(false);
        this.successSignal.set('Encomenda criada com sucesso!');
        setTimeout(() => {
          this.router.navigate(['/admin/dashboard']);
        }, 1500);
      },
      error: (error: any) => {
        this.loadingSignal.set(false);
        const errorMessage = error?.error?.message 
          ? Array.isArray(error.error.message) 
            ? error.error.message.join(', ')
            : error.error.message
          : 'Erro ao criar encomenda';
        this.errorSignal.set(errorMessage);
        console.error('Error creating order:', error);
      }
    });
  }

  // ==================== HELPERS ====================

  resetForm(): void {
    this.orderFormSignal.set({
      customerId: null,
      customer: null,
      size: null,
      coverageType: CoverageType.GANACHE,
      fillingId: null,
      doughId: null,
      deliveryDate: null,
      observations: '',
    });
    this.errorSignal.set(null);
    this.successSignal.set(null);
  }

  cancel(): void {
    this.resetForm();
    this.router.navigate(['/admin/dashboard']);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  clearSuccess(): void {
    this.successSignal.set(null);
  }
}
