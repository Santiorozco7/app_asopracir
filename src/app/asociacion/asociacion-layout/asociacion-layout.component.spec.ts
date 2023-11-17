import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsociacionLayoutComponent } from './asociacion-layout.component';

describe('AsociacionLayoutComponent', () => {
  let component: AsociacionLayoutComponent;
  let fixture: ComponentFixture<AsociacionLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsociacionLayoutComponent]
    });
    fixture = TestBed.createComponent(AsociacionLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
