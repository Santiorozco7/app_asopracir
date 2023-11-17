import { Component, Input, Output, EventEmitter, Renderer2, ElementRef, HostListener} from '@angular/core';

@Component({
  selector: 'app-modal-lotes',
  templateUrl: './modal-lotes.component.html',
  styleUrls: ['./modal-lotes.component.css']
})
export class ModalLotesComponent {
  @Input() modalVisible: boolean = false;
  @Input() cinta: any[] = [];
  @Input() lote: any[] = [];
  @Input() batchID: string = "";

  @Output() cerrarModal = new EventEmitter<void>();
  @Output() editarLote = new EventEmitter<string>();

  @Output() accionSeleccionada = new EventEmitter<string>();

  menuVisible: boolean = false;

  constructor (private renderer: Renderer2, private el: ElementRef) {}

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }

  emitirAccion(accion: string, batchID: string): void {
    this.menuVisible = false;
    this.cerrarModal.emit();
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
    this.accionSeleccionada.emit(accion);
    this.editarLote.emit(batchID)
  }

  getSelectedBatchName(): string {
    const selectedBatch = this.lote.find(item => item.batchID === this.batchID);
    return selectedBatch ? selectedBatch.batchName : '';
  }

  getFilteredCintas(): any[] {
    return this.cinta.filter(cintaItem => cintaItem.batchID === this.batchID);
  }

  /*@HostListener('wheel', ['$event'])
  @HostListener('touchmove', ['$event'])
  onScroll(event: Event): void {
    // Verifica si el modal está visible y se está haciendo scroll
    if (this.modalVisible) {
      setTimeout(() => {
        this.cerrarModal.emit();
        this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
      }, 100);
    }
  } */

  closeButton(event: Event): void {
    // Verifica si el clic se realizó fuera del contenido del modal
    if (event.target === event.currentTarget && this.menuVisible) {
      this.menuVisible = false;
    }
  }
}
