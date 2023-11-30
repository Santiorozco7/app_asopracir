import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRoutesComponent } from './modal-routes.component';

describe('ModalRoutesComponent', () => {
  let component: ModalRoutesComponent;
  let fixture: ComponentFixture<ModalRoutesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalRoutesComponent]
    });
    fixture = TestBed.createComponent(ModalRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
