import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniteEmotionAssessmentComponent } from './unite-emotion-assessment.component';

describe('UniteEmotionAssessmentComponent', () => {
  let component: UniteEmotionAssessmentComponent;
  let fixture: ComponentFixture<UniteEmotionAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniteEmotionAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniteEmotionAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
