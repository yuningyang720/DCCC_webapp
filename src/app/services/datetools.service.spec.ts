import { TestBed } from '@angular/core/testing';

import { DatetoolsService } from './datetools.service';

describe('DatetoolsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatetoolsService = TestBed.get(DatetoolsService);
    expect(service).toBeTruthy();
  });
});
