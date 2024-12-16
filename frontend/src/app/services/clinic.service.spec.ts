import { TestBed } from '@angular/core/testing';

import { ClinicService } from './clinic.service';

describe('ClinicService', () => {
  let service: ClinicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
