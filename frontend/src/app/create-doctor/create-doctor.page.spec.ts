import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateDoctorPage } from './create-doctor.page';

describe('CreateDoctorPage', () => {
  let component: CreateDoctorPage;
  let fixture: ComponentFixture<CreateDoctorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDoctorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
