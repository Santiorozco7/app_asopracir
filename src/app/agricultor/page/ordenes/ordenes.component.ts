import { Component, Renderer2, ElementRef } from '@angular/core';
import { AgricultorService } from '../../agricultor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.css']
})
export class OrdenesComponent {
  orders: any[] = [];
  order: any = {};
  tape: any[] = [];
  verificacionOrden:boolean = false;

  showModalOrder = false;
  orderID?: any;
  showCreateOrder = false;

  constructor(private service: AgricultorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void{
    this.View();
  }

  // Se cambio el View
  View() {
    this.service.getOrders().subscribe(OD => {
      if (OD['state'] === 'Fail') {
        this.verificacionOrden = true;
        console.log("No hay información de ordenes",OD)
      }
      if (OD['state'] === 'Ok') {
        this.verificacionOrden = false;
        this.orders = OD.data;
        this.service.getTapes().subscribe(tape => {
          this.tape = tape.data;
        });
      }
    });
  }
  
  getFormattedDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  }

  modalOrder(orderID:string) {
    console.log(orderID)
    this.orderID = orderID;
    this.showModalOrder = true;
    this.service.getOrder(orderID).subscribe(orden => {
      this.order = orden.data;
    })
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
  }

  closeModalOrder() {
    this.showModalOrder = false;
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
  }
  
  createOrder(){
    this.showCreateOrder = true;
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
  }
  
  closeCreateOrder() {
    this.showCreateOrder = false;
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal--open'); 
  }
}