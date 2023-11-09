import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-order',
  templateUrl: './modal-order.component.html',
  styleUrls: ['./modal-order.component.css']
})
export class ModalOrderComponent {
  @Input() orderVisible: boolean = false;
  @Input() order: any = {};
  @Input() orderID: string = "";
  state: number = 0;
  paso:string = "";

  @Output() cerrarOrder = new EventEmitter<void>();

  ngOnChanges() {
    this.state = Number(this.order.state); // Convierte el valor de "state" a número
    console.log("Valor de state:", this.state); // Agrega esta línea para verificar el valor de state
    this.paso = this.getTextForState(this.state);

  }

  getTextForState(state: number): string {
    switch (state) {
      case 1:
        return 'Agendada';
      case 2:
        return 'En ruta';
      case 3:
        return 'En recolección';
      case 4:
        return 'Recogida';
      case 5:
        return 'Factuda';
      case 6:
        return 'Pagada';
      default:
        return 'En espera de agendar';
    }
  }

  cerrar() {
    console.log('Cerrando el modal de CrearLoteComponent');
    this.cerrarOrder.emit();
  }

}
