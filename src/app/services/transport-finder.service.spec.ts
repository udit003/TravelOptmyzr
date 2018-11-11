import { TestBed, inject } from '@angular/core/testing';

import { TransportFinderService } from './transport-finder.service';

describe('TransportFinderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransportFinderService]
    });
  });

  it('should be created', inject([TransportFinderService], (service: TransportFinderService) => {
    expect(service).toBeTruthy();
  }));
});
