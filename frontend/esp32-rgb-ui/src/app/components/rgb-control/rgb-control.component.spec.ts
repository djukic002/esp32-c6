import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgbControlComponent } from './rgb-control.component';

describe('RgbControlComponent', () => {
  let component: RgbControlComponent;
  let fixture: ComponentFixture<RgbControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RgbControlComponent]
    });
    fixture = TestBed.createComponent(RgbControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
