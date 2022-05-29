import { TestBed } from '@angular/core/testing';

import { EcomNotificationService } from './ecom-notification.service';

describe('EcomNotificationService', () => {
  let service: EcomNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcomNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
