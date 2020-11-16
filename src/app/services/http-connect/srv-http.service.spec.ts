import { TestBed } from '@angular/core/testing';

import { SrvHttpService } from './srv-http.service';

describe('SrvHttpService', () => {
  let service: SrvHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SrvHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
