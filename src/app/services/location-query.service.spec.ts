import { TestBed, inject } from '@angular/core/testing';

import { LocationQueryService } from './location-query.service';

describe('LocationQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationQueryService]
    });
  });

  it('should be created', inject([LocationQueryService], (service: LocationQueryService) => {
    expect(service).toBeTruthy();
  }));
});
