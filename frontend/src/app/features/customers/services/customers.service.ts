import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api/api.service';
import { Customer, CustomerCreateDto } from '../../../core/models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  apiService = inject(ApiService);

  /**
   * Buscar todos os clientes com filtro opcional
   */
  getAll(search?: string): Observable<Customer[]> {
    const params: Record<string, string> = {};
    if (search) {
      params['busca'] = search;
    }
    return this.apiService.get<Customer[]>('customers', params);
  }

  /**
   * Buscar cliente por ID
   */
  getById(id: string): Observable<Customer> {
    return this.apiService.get<Customer>(`customers/${id}`);
  }

  /**
   * Criar novo cliente
   */
  create(data: CustomerCreateDto): Observable<Customer> {
    return this.apiService.post<Customer>('customers', data);
  }

  /**
   * Atualizar cliente existente
   */
  update(id: string, data: Partial<CustomerCreateDto>): Observable<Customer> {
    return this.apiService.patch<Customer>(`customers/${id}`, data);
  }

  /**
   * Deletar cliente
   */
  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`customers/${id}`);
  }
}
