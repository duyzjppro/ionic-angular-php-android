import { TestBed } from '@angular/core/testing';

import { MedicalRecordService } from './medical-record.service';

describe('MedicalRecordService', () => {
  let service: MedicalRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
