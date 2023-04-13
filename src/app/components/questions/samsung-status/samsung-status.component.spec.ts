import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamsungStatusComponent } from './samsung-status.component';

describe('SamsungStatusComponent', () => {
  let component: SamsungStatusComponent;
  let fixture: ComponentFixture<SamsungStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamsungStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamsungStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
