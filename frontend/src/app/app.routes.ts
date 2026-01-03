import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'admin',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: 'admin'
    }
];
