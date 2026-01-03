import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './pages/admin-layout.component/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
    //   {
    //     path: 'calendar',
    //     loadChildren: () => import('../calendar/calendar.routes').then(m => m.CALENDAR_ROUTES)
    //   },
    //   {
    //     path: 'customers',
    //     loadChildren: () => import('../customers/customers.routes').then(m => m.CUSTOMERS_ROUTES)
    //   },
    //   {
    //     path: 'orders',
    //     loadChildren: () => import('../orders/orders.routes').then(m => m.ORDERS_ROUTES)
    //   },
    //   {
    //     path: 'reports',
    //     loadChildren: () => import('../reports/reports.routes').then(m => m.REPORTS_ROUTES)
    //   }
    ]
  }
];
