import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OuraStatusComponent } from './oura-status.component';

describe('OuraStatusComponent', () => {
  let component: OuraStatusComponent;
  let fixture: ComponentFixture<OuraStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OuraStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OuraStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
