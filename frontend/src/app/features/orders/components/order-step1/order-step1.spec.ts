import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStep1 } from './order-step1';

describe('OrderStep1', () => {
  let component: OrderStep1;
  let fixture: ComponentFixture<OrderStep1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStep1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStep1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
