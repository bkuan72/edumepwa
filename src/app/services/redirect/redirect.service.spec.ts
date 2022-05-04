/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RedirectService } from './redirect.service';

describe('Service: Redirect', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedirectService]
    });
  });

  it('should ...', inject([RedirectService], (service: RedirectService) => {
    expect(service).toBeTruthy();
  }));
});
