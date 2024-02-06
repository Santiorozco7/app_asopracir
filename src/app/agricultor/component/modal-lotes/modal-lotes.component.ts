import { Component, Input, Output, EventEmitter, Renderer2, ElementRef, HostListener} from '@angular/core';

interface Lote {
  batchID: string;
  batchName: string;
  responsible: string;
  mainVariety: string;
}

@Component({
  selector: 'app-modal-lotes',
  templateUrl: './modal-lotes.component.html',
  styleUrls: ['./modal-lotes.component.css']
})
export class ModalLotesComponent {
  @Input() showModal: boolean = false;
  @Input() tapes: any[] = [];
  @Input() batches: Lote[] = [];
  @Input() batchID: string = "";

  @Output() closeModal = new EventEmitter<void>();
  @Output() loteEditado = new EventEmitter<void>();

  menuVisible: boolean = false;
  manageBatch =false;
  action: string = "";
  tapeID: string = "";
  showCreateTape = false;

  constructor (private renderer: Renderer2, private el: ElementRef) {}
  
  getSelectedBatchName(): string {
    const selectedBatch = this.batches.find(item => item.batchID === this.batchID);
    return selectedBatch ? selectedBatch.batchName : '';
  }

  getFilteredCintas(): any[] {
    return this.tapes.filter(cintaItem => cintaItem.batchID === this.batchID);
  }

  closeButton(event: Event): void {
    // Verifica si el clic se realizó fuera del contenido del modal
    if (event.target === event.currentTarget && this.menuVisible) {
      this.menuVisible = false;
    }
  }

  @HostListener('wheel', ['$event'])
  @HostListener('touchmove', ['$event'])
  onScroll(event: Event): void {
    if (this.menuVisible) {
      setTimeout(() => {
        this.menuVisible = false;
      }, 100);
    } 
  }
  
  // Crear Cinta -------------------------------------------------------  
  createTape(){
    if (this.batches && this.batches.length > 0) {
      const lotefiltrado = this.batches.find(batche => batche.batchID === this.batchID);
  
      // Verificar si se encontró el lote antes de asignar a this.lote
      if (lotefiltrado) {
        this.batches = [lotefiltrado]; // Asignar el lote encontrado en un array
      } else {
        this.batches = []; // O asignar un array vacío, dependiendo de tus necesidades
      }
    }
    this.showCreateTape = true;
    this.renderer.addClass(this.el.nativeElement.querySelector('.modal'), 'modal--open');
  }
  closeCreateTape() {
    this.showCreateTape = false;
    this.loteEditado.emit();
    this.renderer.removeClass(this.el.nativeElement.querySelector('.modal'), 'modal--open');
  }

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }

  emitAction(accion: string, batchID: string, event: Event): void {
    this.menuVisible = false;
    event.stopPropagation();
    this.manageBatch =true;
    this.renderer.addClass(this.el.nativeElement.querySelector('.modal'), 'modal--open');
    this.action = accion;
    this.batchID=batchID;
  }

  emitActionUpdateTape(accion: string, tapeID: string) {
    this.manageBatch =true;
    this.renderer.addClass(this.el.nativeElement.querySelector('.modal'), 'modal--open');
    this.action = accion;
    this.tapeID = tapeID;
    console.log(this.tapeID)
  }

  closeManageBatch(){
    this.manageBatch =false;
    this.renderer.removeClass(this.el.nativeElement.querySelector('.modal'), 'modal--open');
    this.menuVisible = false;
    this.loteEditado.emit();
  }

  batchDeleted() {
    this.manageBatch =false;
    this.renderer.removeClass(this.el.nativeElement.querySelector('.modal'), 'modal--open');
    this.menuVisible = false;
    this.loteEditado.emit();
    this.closeModal.emit();
  }
}
