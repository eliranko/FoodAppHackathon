import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimalMealComponent } from './optimal-meal.component';

describe('OptimalMealComponent', () => {
  let component: OptimalMealComponent;
  let fixture: ComponentFixture<OptimalMealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimalMealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimalMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
