import { TestBed } from '@angular/core/testing';

import { AuthTokenSessionService } from './auth-token-session.service';

describe('AuthTokenSessionService', () => {
  let service: AuthTokenSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthTokenSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
