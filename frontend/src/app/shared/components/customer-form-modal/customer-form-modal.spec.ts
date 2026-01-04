import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFormModal } from './customer-form-modal';

describe('CustomerFormModal', () => {
  let component: CustomerFormModal;
  let fixture: ComponentFixture<CustomerFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFormModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerFormModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
