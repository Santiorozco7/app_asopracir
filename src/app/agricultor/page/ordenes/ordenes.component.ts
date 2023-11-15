import { Component, Renderer2, ElementRef } from '@angular/core';
import { AgricultorService } from '../../agricultor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.css']
})
export class OrdenesComponent {
  ordenes: any[] = [];
  order: any = {};
  cinta: any[] = [];

  constructor(private service: AgricultorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit(): void{
    this.View();
  }

  // Se cambio el View
  View() {
    this.service.ordenes().subscribe(OD => {
      if (OD['state'] === 'Fail') {
        this.router.navigate(['/']);
      }
      this.ordenes = OD.data;
      this.service.cinta().subscribe(cintas => {
        this.cinta = cintas.data;
      });
    });
    
  }
  
  getFormattedDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  }

  // Modal -----------------------------------------------------------
  orderVisible = false;
  orderID?: any;
  primerCumplimiento: boolean = false;

  mostrarOrder(orderID:string) {
    this.orderID = orderID;
    this.orderVisible = true;
    this.service.orden(orderID).subscribe(orden => {
      this.order = orden.data;
    })
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal-open'); // Agrega la clase al body
  }

  cerrarOrder() {
    this.orderVisible = false;
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open'); // Elimina la clase al cerrar
  }

  // Crear Orden -------------------------------------------------------
  createOrderVisible = false;
  
  mostrarCrearOrden(){
    this.createOrderVisible = true;
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal-open'); // Agrega la clase al body
  }
  cerrarCrearOrden() {
    this.createOrderVisible = false;
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open'); // Elimina la clase al cerrar
  }
}
