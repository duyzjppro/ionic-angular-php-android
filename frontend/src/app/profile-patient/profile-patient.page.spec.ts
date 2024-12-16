import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePatientPage } from './profile-patient.page';

describe('ProfilePatientPage', () => {
  let component: ProfilePatientPage;
  let fixture: ComponentFixture<ProfilePatientPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePatientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
