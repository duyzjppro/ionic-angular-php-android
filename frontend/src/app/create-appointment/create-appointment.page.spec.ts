import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAppointmentPage } from './create-appointment.page';

describe('CreateAppointmentPage', () => {
  let component: CreateAppointmentPage;
  let fixture: ComponentFixture<CreateAppointmentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAppointmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
