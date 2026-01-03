import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-bottom-nav',
  imports: [RouterModule],
  templateUrl: './admin-bottom-nav.html',
  styleUrl: './admin-bottom-nav.scss',
})
export class AdminBottomNav {

  router = inject(Router);

  navItems: NavItem[] = [
    { label: 'Início', icon: 'pi-home', route: '/admin/dashboard' },
    { label: 'Calendário', icon: 'pi-calendar', route: '/admin/calendar' },
    { label: 'Clientes', icon: 'pi-users', route: '/admin/customers' },
    { label: 'Relatórios', icon: 'pi-chart-bar', route: '/admin/reports' }
  ];
}
