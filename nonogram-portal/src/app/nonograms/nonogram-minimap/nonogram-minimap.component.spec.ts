import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonogramMinimapComponent } from './nonogram-minimap.component';

describe('NonogramMinimapComponent', () => {
  let component: NonogramMinimapComponent;
  let fixture: ComponentFixture<NonogramMinimapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonogramMinimapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonogramMinimapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
