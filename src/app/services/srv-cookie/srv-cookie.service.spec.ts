import { TestBed } from '@angular/core/testing';

import { SrvCookieService } from './srv-cookie.service';

describe('CookieService', () => {
  let service: SrvCookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SrvCookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
