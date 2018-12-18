import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NonogramFullComponent } from './nonogram-full.component';

describe('NonogramFullComponent', () => {
  let component: NonogramFullComponent;
  let fixture: ComponentFixture<NonogramFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonogramFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonogramFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
