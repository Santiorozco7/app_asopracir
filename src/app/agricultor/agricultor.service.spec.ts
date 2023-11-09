import { TestBed } from '@angular/core/testing';

import { AgricultorService } from './agricultor.service';

describe('AgricultorService', () => {
  let service: AgricultorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgricultorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
