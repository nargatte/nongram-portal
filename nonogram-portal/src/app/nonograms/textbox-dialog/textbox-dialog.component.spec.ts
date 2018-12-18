import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextboxDialogComponent } from './textbox-dialog.component';

describe('TextboxDialogComponent', () => {
  let component: TextboxDialogComponent;
  let fixture: ComponentFixture<TextboxDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextboxDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextboxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
