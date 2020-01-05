import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeBuilderComponent } from './resume-builder.component';

describe('ResumeBuilderComponent', () => {
  let component: ResumeBuilderComponent;
  let fixture: ComponentFixture<ResumeBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
