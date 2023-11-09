import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColaboradorLayoutComponent } from './colaborador-layout.component';

describe('ColaboradorLayoutComponent', () => {
  let component: ColaboradorLayoutComponent;
  let fixture: ComponentFixture<ColaboradorLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColaboradorLayoutComponent]
    });
    fixture = TestBed.createComponent(ColaboradorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
