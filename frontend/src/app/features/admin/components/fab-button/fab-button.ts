import { Component, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-fab-button',
  imports: [ButtonModule, TooltipModule],
  templateUrl: './fab-button.html',
  styleUrl: './fab-button.scss',
})
export class FabButton {
  router = inject(Router);

  private currentRoute = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
  );

  shouldShow = computed(() => {
    const url = this.router.url;
    return url.includes('/admin/customers') || url.includes('/admin/orders');
  });

  onCreate(): void {
    const url = this.router.url;
    if (url.includes('/admin/customers')) {
      this.router.navigate(['/admin/customers/new']);
    } else if (url.includes('/admin/orders')) {
      this.router.navigate(['/admin/orders/new']);
    }
  }

  getTooltip(): string {
    const url = this.router.url;
    if (url.includes('/admin/customers')) {
      return 'Novo Cliente';
    }
    return 'Nova Encomenda';
  }
}
