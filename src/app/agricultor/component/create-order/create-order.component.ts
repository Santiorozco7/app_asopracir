import { Component, Input, Output, EventEmitter, Renderer2, ElementRef, HostListener } from '@angular/core';
import { AgricultorService } from '../../agricultor.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})

export class CreateOrderComponent {
  @Input() showCreateOrder: boolean = false;
  @Input() tape: any[] = [];
  @Input() orders: any[] = [];
  
  @Output() orderCreated = new EventEmitter<void>();
  @Output() closeCreateOrder = new EventEmitter<void>();

  ordenFiltrada: any[] = [];
  showDialog = false;
  positiveNotification = true;
  message = '';

  constructor(private service: AgricultorService, private renderer: Renderer2, private el: ElementRef) {}

  closeNotification(): void {
    this.showDialog = false;
  }

  ngOnChanges() {
    // Llamar a filterCintaByDate cuando cinta cambie
    this.filterCintaByDate();
  }

  // Método para filtrar los objetos con fecha a menos de 5 días
  filterCintaByDate() {
    const currentDate = new Date();
    this.ordenFiltrada = [];
  
    this.tape.forEach(itemCinta => {
      const endDate = new Date(itemCinta.endDate);
      const timeDiff = endDate.getTime() - currentDate.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
      // Verificar si el orderID no está presente en las órdenes
      const orderIDNotInOrdenes = !this.orders.some(orden => orden.orderID === itemCinta.orderID);
  
      if (daysRemaining <= 5 && orderIDNotInOrdenes) {
        this.ordenFiltrada.push(itemCinta);
      }
    });
  }

  createOrder(tapeID:string){
    this.service.createOrder(tapeID).subscribe(orderCreated => {
      if (orderCreated['state'] === 'Ok') {
        this.orderCreated.emit();
        this.showDialog = true;
        this.positiveNotification = true;
        this.message = `Se ha creado una nueva orden`;
      } else {
        this.orderCreated.emit();
        this.showDialog = true;
        this.positiveNotification = false;
        this.message = '¡Ha ocurrido un error!';
      }
    })
    this.closeCreateOrder.emit();
  }

  closeDialog(event: Event): void {
    // Verifica si el clic se realizó fuera del contenido del modal
    if (event.target === event.currentTarget) {
      this.closeCreateOrder.emit();
      this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
    }
  }
}
