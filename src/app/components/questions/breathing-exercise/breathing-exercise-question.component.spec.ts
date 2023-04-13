import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreathingExerciseQuestionComponent } from './breathing-exercise-question.component';

describe('BreathingExerciseQuestionComponent', () => {
  let component: BreathingExerciseQuestionComponent;
  let fixture: ComponentFixture<BreathingExerciseQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreathingExerciseQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreathingExerciseQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
