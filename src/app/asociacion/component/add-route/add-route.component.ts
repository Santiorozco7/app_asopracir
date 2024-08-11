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

  // Cuadro de diálogo de confirmación
  mostrarDialogo = false;
  
  showConfirmationModal: boolean = false;


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
    this.service.getRoutes(0).subscribe(response => {
      if (response['state'] === 'Ok') {
        this.routes = response.data;
      } else if (response['state'] === 'Fail') {
      }
    });
  }

  routesAUX:number = 0;

  addOrder(routeID:number) {
    this.showConfirmationModal = true;
    this.routesAUX = routeID;
  }

  addOrderToRoute(routeID:number){
    this.service.appendOrderToRoute(routeID, this.orderID).subscribe(result => {
      if (result['state'] === 'Ok') {
        this.showDialog = true;
        this.positiveNotification = true;
        this.message = `Se ha agregado la órden`;
        this.cerrarTodo();
      } else {
        this.showDialog = true;
        this.positiveNotification = false;
        this.message = `Ha ocurrido un error`;
        this.cerrarTodo();
      }
    });
    this.showConfirmationModal = false;
  }

}
