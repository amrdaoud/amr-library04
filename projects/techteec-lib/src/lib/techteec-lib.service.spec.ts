import { TestBed } from '@angular/core/testing';

import { TechteecLibService } from './techteec-lib.service';

describe('TechteecLibService', () => {
  let service: TechteecLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechteecLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
