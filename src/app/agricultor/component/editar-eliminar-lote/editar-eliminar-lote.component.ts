import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgricultorService } from '../../agricultor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-eliminar-lote',
  templateUrl: './editar-eliminar-lote.component.html',
  styleUrls: ['./editar-eliminar-lote.component.css']
})
export class EditarEliminarLoteComponent implements OnChanges {
  @Input() editarloteVisible: boolean = false;
  @Output() loteEditado = new EventEmitter<void>();
  @Output() cerrarEditarlote = new EventEmitter<void>();
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();
  @Input() lote: any[] = [];
  @Input() batchID: string = "";
  editareliminar: boolean = false;

  // Cuadro de diálogo de confirmación
  mostrarDialogo = false;
  mensaje = '';
  confirmCallback: (() => void) | null = null;

  loteForm = this.formBuilder.group({
    batchName: ['', [Validators.required]],
    responsible: ['', [Validators.required]],
    mainVariety: ['', [Validators.required]]
  });

  constructor(private formBuilder: FormBuilder, private service: AgricultorService, private router: Router) {

  }

  cerrarTodo() {
    this.cerrar.emit();
    this.cerrarEditarlote.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detecta cambios en batchID y actualiza el formulario cuando coincida con itemLote.
    if (changes['batchID'] && this.lote && this.lote.length > 0) {
      const itemLote = this.lote.find(item => item['batchID'] === this.batchID);
      if (itemLote) {
        this.loteForm.patchValue({
          batchName: itemLote.batchName,
          responsible: itemLote.responsible,
          mainVariety: itemLote.mainVariety
        });
      }
    }
  }

  onSubmit(): void {
    if (this.loteForm.valid) {
      const formData = this.loteForm.value;
      const batchName: string = formData.batchName ?? "";
      const responsible: string = formData.responsible ?? "";
      const mainVariety: string = formData.mainVariety ?? "";

      // Llama a mostrarConfirmacion antes de realizar la edición
      this.mostrarConfirmacion('¿Estás seguro de que deseas editar este lote?', () => {
        this.service.editarLote(this.batchID, batchName, responsible, mainVariety).subscribe(loteEditado => {
          if (loteEditado['state'] === 'Ok') {
            console.log(loteEditado['state']);
            this.cerrar.emit();
            this.loteEditado.emit();
            this.cerrarModal.emit();
          }
        });
      });
    }
    this.cerrarEditarlote.emit();
    this.cerrarModal.emit();
  }

  eliminarLote() {
    // Llama a mostrarConfirmacion antes de realizar la eliminación
    this.mostrarConfirmacion('¿Estás seguro de que deseas eliminar este lote?', () => {
      this.service.eliminarLote(this.batchID).subscribe(loteEliminado => {
        if (loteEliminado['state'] === 'Ok') {
          console.log(loteEliminado['state']);
          this.cerrar.emit();
          this.loteEditado.emit();
          this.cerrarModal.emit();
        }
      });
    });
    this.cerrarEditarlote.emit();
    this.cerrarModal.emit();
  }

  editarEliminar() {
    this.editareliminar = !this.editareliminar;
  }

  // Función para mostrar el cuadro de diálogo de confirmación
  mostrarConfirmacion(mensaje: string, callback: () => void) {
    this.mensaje = mensaje;
    this.mostrarDialogo = true;
    this.confirmCallback = callback; // Almacenamos el callback para llamarlo después
  }

  // Función para confirmar la acción
  confirmarAccion() {
    // Ejecuta el callback almacenado antes de cerrar el cuadro de diálogo
    if (this.confirmCallback) {
      this.confirmCallback();
    }
    this.mostrarDialogo = false;
    this.confirmCallback = null; // Limpia el callback después de ejecutarlo o cancelarlo
  }

  // Función para cancelar la acción
  cancelarAccion() {
    // Cancela la acción (si es necesario)
    // ...

    // Restablece confirmCallback a null
    this.confirmCallback = null;
    this.mostrarDialogo = false;
  }
}