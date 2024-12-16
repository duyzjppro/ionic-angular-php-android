import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClinicManagementPage } from './clinic-management.page';

describe('ClinicManagementPage', () => {
  let component: ClinicManagementPage;
  let fixture: ComponentFixture<ClinicManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
