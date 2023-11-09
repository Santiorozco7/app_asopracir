import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCintaComponent } from './crear-cinta.component';

describe('CrearCintaComponent', () => {
  let component: CrearCintaComponent;
  let fixture: ComponentFixture<CrearCintaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearCintaComponent]
    });
    fixture = TestBed.createComponent(CrearCintaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
