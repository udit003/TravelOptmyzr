import { TestBed, inject } from '@angular/core/testing';

import { DirectionApiService } from './direction-api.service';

describe('DirectionApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DirectionApiService]
    });
  });

  it('should be created', inject([DirectionApiService], (service: DirectionApiService) => {
    expect(service).toBeTruthy();
  }));
});
