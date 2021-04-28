/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProfileAccessControlService } from './profile-access-control.service';

describe('Service: ProfileAccessControl', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileAccessControlService]
    });
  });

  it('should ...', inject([ProfileAccessControlService], (service: ProfileAccessControlService) => {
    expect(service).toBeTruthy();
  }));
});
