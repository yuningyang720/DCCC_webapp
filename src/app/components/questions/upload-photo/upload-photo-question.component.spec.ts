import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPhotoQuestionComponent } from './upload-photo-question.component';

describe('UploadPhotoQuestionComponent', () => {
  let component: UploadPhotoQuestionComponent;
  let fixture: ComponentFixture<UploadPhotoQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPhotoQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPhotoQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
