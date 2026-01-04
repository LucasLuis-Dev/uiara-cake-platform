import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-fab-button',
  imports: [ButtonModule, TooltipModule],
  templateUrl: './fab-button.html',
  styleUrl: './fab-button.scss',
})
export class FabButton {
  router = inject(Router);

  onCreate(): void {
    this.router.navigate(['/admin/orders/new']);
  }
}
