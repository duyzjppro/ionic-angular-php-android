import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalRecordsPage } from './medical-records.page';

describe('MedicalRecordsPage', () => {
  let component: MedicalRecordsPage;
  let fixture: ComponentFixture<MedicalRecordsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalRecordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
