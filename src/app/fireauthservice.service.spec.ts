import { TestBed } from '@angular/core/testing';
import { FireauthService } from './fireauthservice.service';

describe('FireauthserviceService', () => {
  let service: FireauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
