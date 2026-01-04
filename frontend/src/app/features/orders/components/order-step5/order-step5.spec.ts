import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStep5 } from './order-step5';

describe('OrderStep5', () => {
  let component: OrderStep5;
  let fixture: ComponentFixture<OrderStep5>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStep5]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStep5);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
