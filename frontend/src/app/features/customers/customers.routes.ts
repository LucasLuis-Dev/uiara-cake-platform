import { Routes } from '@angular/router';

export const CUSTOMERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/customers-list/customers-list')
      .then(m => m.CustomersList)
  },
//   {
//     path: 'new',
//     loadComponent: () => import('./pages/customer-form/customer-form.component')
//       .then(m => m.CustomerFormComponent)
//   },
//   {
//     path: 'edit/:id',
//     loadComponent: () => import('./pages/customer-form/customer-form.component')
//       .then(m => m.CustomerFormComponent)
//   },
//   {
//     path: ':id',
//     loadComponent: () => import('./pages/customer-detail/customer-detail.component')
//       .then(m => m.CustomerDetailComponent)
//   }
];
