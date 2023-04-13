import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniteBreathingComponent } from './unite-breathing.component';

describe('UniteBreathingComponent', () => {
  let component: UniteBreathingComponent;
  let fixture: ComponentFixture<UniteBreathingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniteBreathingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniteBreathingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
