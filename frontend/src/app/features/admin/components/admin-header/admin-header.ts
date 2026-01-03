import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthFacade } from '../../../auth/facades/auth.facade';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';


@Component({
  selector: 'app-admin-header',
  imports: [ButtonModule, AvatarModule],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.scss',
})
export class AdminHeader {
  @Output() toggleSidebar = new EventEmitter<void>();

  authFacade = inject(AuthFacade);
  router = inject(Router);

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onLogout(): void {
    this.authFacade.logout();
  }
}
