import { TestBed } from '@angular/core/testing';

import { ReportsFacade } from './reports.facade';

describe('ReportsFacade', () => {
  let service: ReportsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportsFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
