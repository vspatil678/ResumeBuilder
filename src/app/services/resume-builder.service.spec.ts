import { TestBed } from '@angular/core/testing';

import { ResumeBuilderService } from './resume-builder.service';

describe('ResumeBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResumeBuilderService = TestBed.get(ResumeBuilderService);
    expect(service).toBeTruthy();
  });
});
