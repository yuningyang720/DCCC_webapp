import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageScaleQuestionComponent } from './image-scale-question.component';

describe('ImageScaleQuestionComponent', () => {
  let component: ImageScaleQuestionComponent;
  let fixture: ComponentFixture<ImageScaleQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageScaleQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageScaleQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
