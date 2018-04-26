import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCategoriesComponent } from './shared-categories.component';

describe('SharedCategoriesComponent', () => {
  let component: SharedCategoriesComponent;
  let fixture: ComponentFixture<SharedCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
