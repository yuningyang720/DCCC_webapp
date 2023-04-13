import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BigTextQuestionComponent } from './big-text-question.component';

describe('BigTextQuestionComponent', () => {
  let component: BigTextQuestionComponent;
  let fixture: ComponentFixture<BigTextQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BigTextQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BigTextQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
