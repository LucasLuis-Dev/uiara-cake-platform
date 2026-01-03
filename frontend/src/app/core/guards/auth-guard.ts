import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { StorageService } from '../services/storage/storage.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storageService = inject(StorageService);
  
  const token = storageService.getToken();

  if (token) {
    return true;
  }

  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
