import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-lotes',
  templateUrl: './modal-lotes.component.html',
  styleUrls: ['./modal-lotes.component.css']
})
export class ModalLotesComponent {
  @Input() modalVisible: boolean = false;
  @Input() cinta: any[] = [];
  @Input() batchID: string = "";

  @Output() cerrarModal = new EventEmitter<void>();
  @Output() editarLote = new EventEmitter<string>();

  mostrar(){
    console.log(this.batchID);
  }

  cerrar() {
    console.log('Cerrando el modal de CrearLoteComponent');
    this.cerrarModal.emit();
  }

  editar(batchID:string){
    this.editarLote.emit(batchID);
    // this.cerrarModal.emit();
  }
}
