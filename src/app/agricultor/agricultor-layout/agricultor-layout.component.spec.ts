import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgricultorLayoutComponent } from './agricultor-layout.component';

describe('AgricultorLayoutComponent', () => {
  let component: AgricultorLayoutComponent;
  let fixture: ComponentFixture<AgricultorLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgricultorLayoutComponent]
    });
    fixture = TestBed.createComponent(AgricultorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
