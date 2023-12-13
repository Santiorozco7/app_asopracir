import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProductionComponent } from './modal-production.component';

describe('ModalProductionComponent', () => {
  let component: ModalProductionComponent;
  let fixture: ComponentFixture<ModalProductionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalProductionComponent]
    });
    fixture = TestBed.createComponent(ModalProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
