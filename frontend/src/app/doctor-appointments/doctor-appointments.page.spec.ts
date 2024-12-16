import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorAppointmentsPage } from './doctor-appointments.page';

describe('DoctorAppointmentsPage', () => {
  let component: DoctorAppointmentsPage;
  let fixture: ComponentFixture<DoctorAppointmentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorAppointmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
