import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBottomNav } from './admin-bottom-nav';

describe('AdminBottomNav', () => {
  let component: AdminBottomNav;
  let fixture: ComponentFixture<AdminBottomNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBottomNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBottomNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
