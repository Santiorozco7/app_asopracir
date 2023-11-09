import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-historial',
  templateUrl: './modal-historial.component.html',
  styleUrls: ['./modal-historial.component.css']
})
export class ModalHistorialComponent {
  @Input() historialVisible: boolean = false;
  @Input() detallesHistorial: any = {};

  @Output() cerrarHistorial = new EventEmitter<void>();

  ngOnChanges() {
  }

  cerrar() {
    console.log('Cerrando el modal de CrearLoteComponent');
    this.cerrarHistorial.emit();
  }

}
