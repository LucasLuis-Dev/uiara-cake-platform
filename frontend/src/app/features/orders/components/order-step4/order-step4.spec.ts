import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStep4 } from './order-step4';

describe('OrderStep4', () => {
  let component: OrderStep4;
  let fixture: ComponentFixture<OrderStep4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStep4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStep4);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
