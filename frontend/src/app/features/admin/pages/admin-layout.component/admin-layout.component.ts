import { Component, signal } from '@angular/core';
import { AdminBottomNav } from '../../components/admin-bottom-nav/admin-bottom-nav';
import { AdminHeader } from '../../components/admin-header/admin-header';
import { FabButton } from '../../components/fab-button/fab-button';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout.component',
  imports: [AdminBottomNav, AdminHeader, FabButton, RouterOutlet,],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  sidebarVisible = signal(false);

  toggleSidebar(): void {
    this.sidebarVisible.update(v => !v);
  }
}
