import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  imports: [],
  templateUrl: './metric-card.html',
  styleUrl: './metric-card.scss',
})
export class MetricCard {
    @Input() icon: string = '';
    @Input() label: string = '';
    @Input() value: number = 0;
    @Input() isCurrency: boolean = false;
    @Input() color: 'primary' | 'success' | 'warning' | 'info' = 'primary';

    getFormattedValue(): string {
      if (this.isCurrency) {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(this.value);
      }
      return this.value.toString();
    }
}

