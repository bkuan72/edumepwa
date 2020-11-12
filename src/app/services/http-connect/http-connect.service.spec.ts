import { TestBed } from '@angular/core/testing';

import { HttpConnectService } from './http-connect.service';

describe('HttpConnectService', () => {
  let service: HttpConnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpConnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
