import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStep3 } from './order-step3';

describe('OrderStep3', () => {
  let component: OrderStep3;
  let fixture: ComponentFixture<OrderStep3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStep3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStep3);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
