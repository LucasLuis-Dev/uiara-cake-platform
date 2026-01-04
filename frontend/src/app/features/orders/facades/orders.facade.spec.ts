import { TestBed } from '@angular/core/testing';

import { OrdersFacade } from './orders.facade';

describe('OrdersFacade', () => {
  let service: OrdersFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
