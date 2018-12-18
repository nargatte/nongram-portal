import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Nonogram3dViewComponent } from './nonogram3d-view.component';

describe('Nonogram3dViewComponent', () => {
  let component: Nonogram3dViewComponent;
  let fixture: ComponentFixture<Nonogram3dViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Nonogram3dViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Nonogram3dViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
