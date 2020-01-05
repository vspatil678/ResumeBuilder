import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeValidationComponent } from './resume-validation.component';

describe('ResumeValidationComponent', () => {
  let component: ResumeValidationComponent;
  let fixture: ComponentFixture<ResumeValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
