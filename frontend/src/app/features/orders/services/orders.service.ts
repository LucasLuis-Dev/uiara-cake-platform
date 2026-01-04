import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api/api.service';
import { Order, OrderCreateDto, OrderStatus } from '../../../core/models/order.model';
import { Flavor, FlavorType } from '../../../core/models/flavor.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  apiService = inject(ApiService);

  /**
   * Buscar todas as encomendas
   */
  getAll(status?: OrderStatus, startDate?: string, endDate?: string): Observable<Order[]> {
    const params: Record<string, string> = {};
    if (status) params['status'] = status;
    if (startDate) params['startDate'] = startDate;
    if (endDate) params['endDate'] = endDate;
    return this.apiService.get<Order[]>('orders', params);
  }

  /**
   * Buscar encomenda por ID
   */
  getById(id: string): Observable<Order> {
    return this.apiService.get<Order>(`orders/${id}`);
  }

  /**
   * Criar nova encomenda
   */
  create(data: OrderCreateDto): Observable<Order> {
    return this.apiService.post<Order>('orders', data);
  }

  /**
   * Atualizar encomenda
   */
  update(id: string, data: Partial<OrderCreateDto>): Observable<Order> {
    return this.apiService.patch<Order>(`orders/${id}`, data);
  }

  /**
   * Atualizar status da encomenda
   */
  updateStatus(id: string, status: OrderStatus): Observable<Order> {
    return this.apiService.patch<Order>(`orders/${id}/status`, { status });
  }

  /**
   * Deletar encomenda
   */
  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`orders/${id}`);
  }

  /**
   * Buscar sabores (recheios)
   */
  getFillings(): Observable<Flavor[]> {
    return this.apiService.get<Flavor[]>('flavors', { type: FlavorType.FILLING });
  }

  /**
   * Buscar massas
   */
  getDoughs(): Observable<Flavor[]> {
    return this.apiService.get<Flavor[]>('flavors', { type: FlavorType.DOUGH });
  }
}
