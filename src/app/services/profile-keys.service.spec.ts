import { TestBed } from '@angular/core/testing';

import { ProfileKeysService } from './profile-keys.service';

describe('ProfileKeysService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileKeysService = TestBed.get(ProfileKeysService);
    expect(service).toBeTruthy();
  });
});
