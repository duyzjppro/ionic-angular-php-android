import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClinicsPage } from './clinics.page';

describe('ClinicsPage', () => {
  let component: ClinicsPage;
  let fixture: ComponentFixture<ClinicsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
