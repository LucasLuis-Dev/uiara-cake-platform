import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  // Signals
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Computed (read-only)
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(credentials: LoginRequest): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.authService.login(credentials).subscribe({
      next: () => {
        this.loadingSignal.set(false);
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.loadingSignal.set(false);
        this.errorSignal.set('Email ou senha inválidos');
        console.error('Login error:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
