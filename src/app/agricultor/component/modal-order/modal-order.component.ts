import { Component, Input, Output, EventEmitter, Renderer2, ElementRef, HostListener } from '@angular/core';

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

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnChanges() {
    this.state = Number(this.order.state); // Convierte el valor de "state" a número
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
        return 'Facturada';
      case 6:
        return 'Pagada';
      default:
        return 'En espera de agendar';
    }
  }

  @HostListener('wheel', ['$event'])
  @HostListener('touchmove', ['$event'])
  onScroll(event: Event): void {
    // Verifica si el modal está visible y se está haciendo scroll
    if (this.orderVisible) {
      this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
      setTimeout(() => {
        this.cerrarOrder.emit();
        this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
      }, 200);
    }
  }
  
  cerrarDialogo(event: Event): void {
    // Verifica si el clic se realizó fuera del contenido del modal
    if (event.target === event.currentTarget) {
      this.cerrarOrder.emit();
      this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
    }
  }
}
