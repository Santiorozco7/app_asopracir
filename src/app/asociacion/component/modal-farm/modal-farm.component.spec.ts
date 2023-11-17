import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFarmComponent } from './modal-farm.component';

describe('ModalFarmComponent', () => {
  let component: ModalFarmComponent;
  let fixture: ComponentFixture<ModalFarmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalFarmComponent]
    });
    fixture = TestBed.createComponent(ModalFarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
