import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDoctorPage } from './edit-doctor.page';

describe('EditDoctorPage', () => {
  let component: EditDoctorPage;
  let fixture: ComponentFixture<EditDoctorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDoctorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
