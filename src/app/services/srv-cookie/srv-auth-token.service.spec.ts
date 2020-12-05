import { TestBed } from '@angular/core/testing';

import { SrvAuthTokenService } from './srv-auth-token.service';

describe('CookieService', () => {
  let service: SrvAuthTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SrvAuthTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
