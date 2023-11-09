import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEliminarLoteComponent } from './editar-eliminar-lote.component';

describe('EditarEliminarLoteComponent', () => {
  let component: EditarEliminarLoteComponent;
  let fixture: ComponentFixture<EditarEliminarLoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarEliminarLoteComponent]
    });
    fixture = TestBed.createComponent(EditarEliminarLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
