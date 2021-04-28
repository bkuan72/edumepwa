/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserAccountGroupCacheService } from './user-account-group-cache.service';

describe('Service: UserAccountGroupCache', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAccountGroupCacheService]
    });
  });

  it('should ...', inject([UserAccountGroupCacheService], (service: UserAccountGroupCacheService) => {
    expect(service).toBeTruthy();
  }));
});
