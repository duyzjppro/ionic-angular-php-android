import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSlotsPage } from './time-slots.page';

describe('TimeSlotsPage', () => {
  let component: TimeSlotsPage;
  let fixture: ComponentFixture<TimeSlotsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSlotsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
