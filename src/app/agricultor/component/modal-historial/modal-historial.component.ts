import { Component, Input, Output, EventEmitter, Renderer2, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal-historial',
  templateUrl: './modal-historial.component.html',
  styleUrls: ['./modal-historial.component.css']
})

export class ModalHistorialComponent {
  @Input() historialVisible: boolean = false;
  @Input() detallesHistorial: any = {};

  @Output() cerrarHistorial = new EventEmitter<void>();

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnChanges() {
  }

  @HostListener('wheel', ['$event'])
  @HostListener('touchmove', ['$event'])
  onScroll(event: Event): void {
    // Verifica si el modal está visible y se está haciendo scroll
    if (this.historialVisible) {
      this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
      setTimeout(() => {
        this.cerrarHistorial.emit();
        this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
      }, 200);
    }
  }
  
  cerrarDialogo(event: Event): void {
    // Verifica si el clic se realizó fuera del contenido del modal
    if (event.target === event.currentTarget) {
      this.cerrarHistorial.emit();
      this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
    }
  }
}
