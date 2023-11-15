import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, Renderer2, ElementRef, HostListener } from '@angular/core';
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

  constructor(private formBuilder: FormBuilder, private service: AgricultorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {

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
      this.mostrarConfirmacion('¿Estás seguro de editar el lote ', this.getSelectedBatchName(), () => {
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
    //this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal-open'); // Agrega la clase al body
  }

  eliminarLote() {
    // Llama a mostrarConfirmacion antes de realizar la eliminación
    this.mostrarConfirmacion('¿Estás seguro de eliminar el lote: ', this.getSelectedBatchName(), () => {
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
    //this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal-open'); // Agrega la clase al body
  }

  getSelectedBatchName(): string {
    const selectedBatch = this.lote.find(item => item.batchID === this.batchID);
    return selectedBatch ? selectedBatch.batchName : '';
  }
  
  editarEliminar() {
    this.editareliminar = !this.editareliminar;
  }

  // Función para mostrar el cuadro de diálogo de confirmación
  mostrarConfirmacion(mensaje: string, batchName: string, callback: () => void) {
    this.mensaje = `${mensaje} ${batchName} ?`;
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
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
  }

  // Función para cancelar la acción
  cancelarAccion() {
    // Restablece confirmCallback a null
    this.confirmCallback = null;
    this.mostrarDialogo = false;    
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
  }

  @HostListener('wheel', ['$event'])
  @HostListener('touchmove', ['$event'])
  onScroll(event: Event): void {
    // Verifica si el modal está visible y se está haciendo scroll
    if (this.mostrarDialogo || this.editarloteVisible) {
      this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
      this.mostrarDialogo = false;
      setTimeout(() => {
        this.cerrarEditarlote.emit();
        this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
      }, 200);
    }
  }
  
  cerrarDialogo(event: Event): void {
    // Verifica si el clic se realizó fuera del contenido del modal
    if (event.target === event.currentTarget) {
      this.mostrarDialogo = false;
      this.cerrarEditarlote.emit();
      this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
    }
  }
}