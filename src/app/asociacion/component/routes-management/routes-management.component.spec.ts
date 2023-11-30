import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesManagementComponent } from './routes-management.component';

describe('RoutesManagementComponent', () => {
  let component: RoutesManagementComponent;
  let fixture: ComponentFixture<RoutesManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoutesManagementComponent]
    });
    fixture = TestBed.createComponent(RoutesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
