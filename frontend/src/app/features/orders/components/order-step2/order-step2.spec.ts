import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStep2 } from './order-step2';

describe('OrderStep2', () => {
  let component: OrderStep2;
  let fixture: ComponentFixture<OrderStep2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStep2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStep2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
