import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTransportComponent } from './modal-transport.component';

describe('ModalTransportComponent', () => {
  let component: ModalTransportComponent;
  let fixture: ComponentFixture<ModalTransportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalTransportComponent]
    });
    fixture = TestBed.createComponent(ModalTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
