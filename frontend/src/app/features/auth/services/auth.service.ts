import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api/api.service';
import { StorageService } from '../../../core/services/storage/storage.service';
import { LoginRequest, LoginResponse } from '../../../core/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('auth/login', credentials).pipe(
      tap(response => {
        this.storageService.setToken(response.access_token);
      })
    );
  }

  logout(): void {
    this.storageService.clear();
  }

  isAuthenticated(): boolean {
    return !!this.storageService.getToken();
  }
}