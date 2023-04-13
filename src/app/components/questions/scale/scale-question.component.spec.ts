import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaleQuestionComponent } from './scale-question.component';

describe('ScaleQuestionComponent', () => {
  let component: ScaleQuestionComponent;
  let fixture: ComponentFixture<ScaleQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScaleQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScaleQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
