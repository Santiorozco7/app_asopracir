import { Component } from '@angular/core';
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

  constructor(private service: AgricultorService, private router: Router) {
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
      console.log("Estas son las ordenes",OD.data);
      this.service.cinta().subscribe(cintas => {
        this.cinta = cintas.data;
        console.log("Cintas:",this.cinta);
        });
    });
    
  }

  // Modal -----------------------------------------------------------
  orderVisible = false;
  orderID?: any;
  primerCumplimiento: boolean = false;

  mostrarOrder(orderID:string) {
    this.orderID = orderID;
    this.orderVisible = true;
    console.log(orderID);
    this.service.orden(orderID).subscribe(orden => {
      this.order = orden.data;
      console.log(this.order);
    })
  }

  cerrarOrder() {
    this.orderVisible = false;
  }

  // Crear Orden -------------------------------------------------------
  createOrderVisible = false;
  
  mostrarCrearOrden(){
    this.createOrderVisible = true;
    console.log('crearLoteVisible actualizado:', this.createOrderVisible);
  }
  cerrarCrearOrden() {
    this.createOrderVisible = false;
    console.log('crearLoteVisible actualizado:', this.createOrderVisible);

  }
}
