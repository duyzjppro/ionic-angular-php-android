import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewMedicalRecordsPage } from './view-medical-records.page';

describe('ViewMedicalRecordsPage', () => {
  let component: ViewMedicalRecordsPage;
  let fixture: ComponentFixture<ViewMedicalRecordsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMedicalRecordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
