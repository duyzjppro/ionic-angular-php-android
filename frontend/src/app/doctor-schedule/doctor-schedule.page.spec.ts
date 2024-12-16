import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorSchedulePage } from './doctor-schedule.page';

describe('DoctorSchedulePage', () => {
  let component: DoctorSchedulePage;
  let fixture: ComponentFixture<DoctorSchedulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
