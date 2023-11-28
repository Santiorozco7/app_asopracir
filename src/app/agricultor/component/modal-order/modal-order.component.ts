import { Component, Input, Output, EventEmitter, Renderer2, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal-order',
  templateUrl: './modal-order.component.html',
  styleUrls: ['./modal-order.component.css']
})

export class ModalOrderComponent {
  @Input() showModalOrder: boolean = false;
  @Input() order: any = {};
  @Input() orderID: string = "";

  @Output() closeModalOrder = new EventEmitter<void>();

  state: number = 0;
  step:string = "";
  
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnChanges() {
    this.state = Number(this.order.state); // Convierte el valor de "state" a número
    this.step = this.getTextForState(this.state);
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

  closeDialog(event: Event): void {
    // Verifica si el clic se realizó fuera del contenido del modal
    if (event.target === event.currentTarget) {
      this.closeModalOrder.emit();
      this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
    }
  }
}
