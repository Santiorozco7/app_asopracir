import { Component, Input, Output, EventEmitter, Renderer2, ElementRef, HostListener } from '@angular/core';
import { AgricultorService } from '../../agricultor.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})

export class CreateOrderComponent {
  @Input() createOrderVisible: boolean = false;
  @Input() cinta: any[] = [];
  @Input() ordenes: any[] = [];
  ordenFiltrada: any[] = [];

  @Output() cerrarCrearOrden = new EventEmitter<void>();
  @Output() actualizarOrden = new EventEmitter<void>();

  constructor(private service: AgricultorService, private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnChanges() {
    // Llamar a filterCintaByDate cuando cinta cambie
    this.filterCintaByDate();
  }

  // Método para filtrar los objetos con fecha a menos de 5 días
  filterCintaByDate() {
    const currentDate = new Date();
    this.ordenFiltrada = [];
  
    this.cinta.forEach(itemCinta => {
      const endDate = new Date(itemCinta.endDate);
      const timeDiff = endDate.getTime() - currentDate.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
      // Verificar si el orderID no está presente en las órdenes
      const orderIDNotInOrdenes = !this.ordenes.some(orden => orden.orderID === itemCinta.orderID);
  
      if (daysRemaining <= 5 && orderIDNotInOrdenes) {
        this.ordenFiltrada.push(itemCinta);
      }
    });
  }

  agregarOrden(tapeID:string){
    console.log("orden agregada");
    console.log(tapeID);
    this.service.crearOrden(tapeID).subscribe(ordenCreada => {
      if(ordenCreada['state'] === 'Ok') {
        console.log(ordenCreada['state']);
        // this.router.navigate(['/agricultor']);
        this.cerrarCrearOrden.emit();
        this.actualizarOrden.emit();
      }
    })
  }

  @HostListener('wheel', ['$event'])
  @HostListener('touchmove', ['$event'])
  onScroll(event: Event): void {
    // Verifica si el modal está visible y se está haciendo scroll
    if (this.createOrderVisible) {
      this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
      setTimeout(() => {
        this.cerrarCrearOrden.emit();
        this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
      }, 200);
    }
  }
  
  cerrarDialogo(event: Event): void {
    // Verifica si el clic se realizó fuera del contenido del modal
    if (event.target === event.currentTarget) {
      this.cerrarCrearOrden.emit();
      this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
    }
  }
}
