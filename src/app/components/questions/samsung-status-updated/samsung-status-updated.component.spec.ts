import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamsungStatusUpdatedComponent } from './samsung-status-updated.component';

describe('SamsungStatusUpdatedComponent', () => {
  let component: SamsungStatusUpdatedComponent;
  let fixture: ComponentFixture<SamsungStatusUpdatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamsungStatusUpdatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamsungStatusUpdatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
