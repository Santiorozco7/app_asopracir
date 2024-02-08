import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';

interface OrderInformation {
  collab: {
    docNumber: number;
    docType: number;
    email: string;
    firstLastname: string;
    names: string;
    phoneNumber: number;
  };
  orders: Array<{
    GPSposition: string;
    farmID: number;
    farmName: string;
    name: string; // Nombre completo del cliente
    numBunches: number;
    orderID: number;
    phoneNumber: string; // Número de teléfono del cliente
    startDate: string; // Fecha de inicio
    zoneName: string;
  }>;
  pickupDate: string;
  plate: string;
  routeID: number;
  routeState: number;
  totalBunches: number;
  transporter: {
    docNumber: number;
    docType: number;
    email: string;
    firstLastname: string;
    names: string;
    phoneNumber: number;
  };
  vehState: number;
  vehType: number;
}

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.css']
})
export class AddRouteComponent {
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() cerrarActualizar = new EventEmitter<void>();
  @Input() addRouteVisible: boolean = false;  
  @Input() orderID:number = 0;

  routes: OrderInformation[] = [];
  filteredRoutes: OrderInformation[] = [];

  // Cuadro de diálogo de confirmación
  mostrarDialogo = false;
  
  showDialog = false;
  positiveNotification = true;
  message = '';

  confirmCallback: (() => void) | null = null;

  routeState: { [key: number]: string } = {
    0: 'No iniciada',
    1: 'Iniciada',
    2: 'Finalizada',
    3: 'Acopio',
    4: 'Vendida'
  };

  constructor(private service: AsociacionService, private router: Router) {
  }

  closeNotification(): void {
    this.showDialog = false;
  }

  cerrarTodo() {
    this.cerrarModal.emit();
  }

  ngOnChanges(): void {
    console.log("boolean ", this.addRouteVisible);
    console.log("orderID", this.orderID);
    this.service.getRoutes().subscribe(routes => {
      if (routes['state'] === 'Ok') {
        this.routes = routes.data;
        console.log("Se encontraron las rutas", this.routes);
        this.filteredRoutes = this.routes.filter(route => route.routeState.toString().trim() === '0' || route.routeState.toString().trim() === '1');
        console.log("Rutas con estado 0:", this.filteredRoutes);
      } else {
        this.routes = routes.data;
        console.log("No se encontraron las rutas", this.routes);
      }
    })
  }

  addOrderToRoute(routeID:number){
    console.log("orderID: ",this.orderID," routeID: ",routeID);
    this.service.appendOrderToRoute(routeID, this.orderID).subscribe(result => {
      if (result['state'] === 'Ok') {
        console.log("Orden agregada", result);
        this.showDialog = true;
        this.positiveNotification = true;
        this.message = `Se ha agregado la órden`;
        this.cerrarTodo();
      } else {
        console.log("Orden no agregada", result);
        this.showDialog = true;
        this.positiveNotification = false;
        this.message = `Ha ocurrido un error`;
        this.cerrarTodo();
      }
    })
  }

}
