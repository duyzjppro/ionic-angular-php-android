import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageAppointmentsPage } from './manage-appointments.page';

describe('ManageAppointmentsPage', () => {
  let component: ManageAppointmentsPage;
  let fixture: ComponentFixture<ManageAppointmentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAppointmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
