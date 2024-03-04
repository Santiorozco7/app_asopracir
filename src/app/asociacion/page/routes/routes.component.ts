import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    orderID: number;
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
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent {
  routes: OrderInformation[] = [];
  tapesAlert:boolean = false;
  ordersAlert:boolean = false;
  filterValue:number = 0;
  showConfirmationModal: boolean = false;

  showDialog = false;
  positiveNotification = true;
  message = '';

  filterUser = this.formBuilder.group({
    state: [0] 
  });

  typeFilter: { [key: number]: string } = {
    0: 'Preparación',
    1: 'Agendada',
    2: 'En ruta',
    3: 'En recolección',
    4: 'Recogida',
    5: 'Facturada',
    6: 'Pagada',
  };

  routeState: { [key: number]: string } = {
    0: 'No iniciada',
    1: 'Iniciada',
    2: 'Finalizada',
    3: 'Acopio',
    4: 'Vendida'
  };

  constructor(private formBuilder: FormBuilder, private service: AsociacionService, private router: Router) {
    this.filterUser.valueChanges.subscribe(() => {
      this.filterValue = this.filterUser.value.state ?? 0;
      console.log(this.filterValue);
      this.View();
    });
  }

  closeNotification(): void {
    this.showDialog = false;
  }

  ngOnInit(): void{
    this.View();
  }

  View() {
    this.service.getRoutes(this.filterValue, undefined, undefined).subscribe(routes => {
      if (routes['state'] === 'Ok') {
        this.routes = routes.data;
        console.log("Se encontraron las rutas", this.routes);
      } else {
        this.routes = routes.data;
        console.log("No se encontraron las rutas", this.routes);
      }
    })
  }

  cancelRoute(routeID:number, event: Event){
    event.stopPropagation();
    this.showConfirmationModal = true;
    this.routesAUX = routeID;
  }
  
  cancelRouteConfirmed(routeID: number) {
    this.service.cancelRoute(routeID).subscribe(result => {
      if (result['state'] === 'Ok') {
        console.log("Se elimino la ruta correctamente");
        this.showDialog = true;
        this.positiveNotification = true;
        this.message = `Se ha eliminado la órden`;
      } else {
        console.log("No se logro eliminar la ruta correctamente");
        this.showDialog = true;
        this.positiveNotification = false;
        this.message = `No se ha podido eliminar la órden`;
      }
      this.View();
    });
    this.showConfirmationModal = false;
  }

  // Modal de rutas -----------------------------------------------------
  rutasVisible:boolean = false;
  routesAUX:number = 0;
  managementFlag:boolean = false;
  
  abrirmodalRutas(routeID:number, managementFlag:boolean) {
    this.routesAUX = routeID;
    this.managementFlag = managementFlag;
    console.log("Información: ", this.routesAUX);
    this.rutasVisible = true;
  }

  abrirCrearRuta(managementFlag:boolean) {
    this.managementFlag = managementFlag;
    this.rutasVisible = true;
  }

  cerrarmodalRutas() {
    this.rutasVisible = false;
    setTimeout(() => {
      this.View();
    }, 0);
  }
}
