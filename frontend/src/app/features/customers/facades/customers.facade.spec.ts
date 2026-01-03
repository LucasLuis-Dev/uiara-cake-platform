import { TestBed } from '@angular/core/testing';

import { CustomersFacade } from './customers.facade';

describe('CustomersFacade', () => {
  let service: CustomersFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomersFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
