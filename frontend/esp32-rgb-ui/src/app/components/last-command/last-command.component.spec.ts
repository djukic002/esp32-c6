import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastCommandComponent } from './last-command.component';

describe('LastCommandComponent', () => {
  let component: LastCommandComponent;
  let fixture: ComponentFixture<LastCommandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LastCommandComponent]
    });
    fixture = TestBed.createComponent(LastCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
