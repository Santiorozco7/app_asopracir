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
        return 'Tu cosecha ha sido <strong> agendada</strong>';
      case 2:
        return 'Tu cosecha está en <strong> ruta</strong>';
      case 3:
        return 'Tu cosecha está en <strong> recolección</strong>';
      case 4:
        return 'Tu cosecha ha sido <strong> recogida</strong>';
      case 5:
        return 'Tu cosecha ha sido <strong> facturada</strong>';
      case 6:
        return 'Tu cosecha ha sido <strong> pagada</strong>';
      default:
        return 'Tu cosecha está <strong> en espera de agendar</strong>';
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
