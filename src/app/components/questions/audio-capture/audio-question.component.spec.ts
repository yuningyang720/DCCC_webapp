import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioQuestionComponent } from './audio-question.component';

describe('AudioQuestionComponent', () => {
  let component: AudioQuestionComponent;
  let fixture: ComponentFixture<AudioQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
