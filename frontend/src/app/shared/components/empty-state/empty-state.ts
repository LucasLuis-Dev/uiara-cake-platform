import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  imports: [],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  @Input() icon: string = 'pi-inbox';
  @Input() message: string = 'Nenhum dado disponível';
}
