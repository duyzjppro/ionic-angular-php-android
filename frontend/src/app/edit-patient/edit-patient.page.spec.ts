import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPatientPage } from './edit-patient.page';

describe('EditPatientPage', () => {
  let component: EditPatientPage;
  let fixture: ComponentFixture<EditPatientPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPatientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
