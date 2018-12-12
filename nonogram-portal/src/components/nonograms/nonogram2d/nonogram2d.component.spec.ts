import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Nonogram2dComponent } from './nonogram2d.component';

describe('Nonogram2dComponent', () => {
  let component: Nonogram2dComponent;
  let fixture: ComponentFixture<Nonogram2dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Nonogram2dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Nonogram2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
