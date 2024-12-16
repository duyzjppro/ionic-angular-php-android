import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShiftsPage } from './shifts.page';

describe('ShiftsPage', () => {
  let component: ShiftsPage;
  let fixture: ComponentFixture<ShiftsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
