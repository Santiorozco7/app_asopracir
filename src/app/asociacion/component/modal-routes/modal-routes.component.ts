import { Component, Input, Output, EventEmitter} from '@angular/core';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

interface OrderInformation {
  collab: {
    docNumber: number;
    docType: string;
    email: string;
    firstLastname: string;
    names: string;
    phoneNumber: number;
  };
  endWeight: string;
  orders: Array<{
    GPSposition: string;
    farmID: number;
    farmName: string;
    numBunches: number;
    orderID: number;
    zoneName: string;
  }>;
  pickupDate: string;
  plate: string;
  routeID: number;
  routeState: string;
  startWeight: string;
  totalBunches: number;
  totalPayment: number;
  totalWeight: number;
  transporter: {
    docNumber: number;
    docType: string;
    email: string;
    firstLastname: string;
    names: string;
    phoneNumber: number;
  };
  vehState: string;
  vehType: string;
}

interface transporterInformation {
  altPhoneNumber: string;
  capacity: string;
  docNumber: string;
  docType: string;
  email: string;
  firstLastname: string;
  licenseExpiration: string;
  licenseType: string;
  names: string;
  phoneNumber: string;
  plate: string;
  secondLastname: string;
  soatExpiration: string;
  state: string;
  techExpiration: string;
  transID: number;
  type: string;
  userID: string;
  valid: boolean;
  vehID: number;
}

interface CollaboratorInformation {
  altPhoneNumber: string;
  collabID: number;
  collaboratorRole: string;
  docNumber: number;
  docType: string;
  email: string;
  firstLastname: string;
  names: string;
  phoneNumber: number;
  secondLastname: string;
  userID: number;
}

@Component({
  selector: 'app-modal-routes',
  templateUrl: './modal-routes.component.html',
  styleUrls: ['./modal-routes.component.css']
})
export class ModalRoutesComponent {
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() cerrarActualizar = new EventEmitter<void>();
  @Input() rutasVisible: boolean = false;
  @Input() managementFlag:boolean = false;
  @Input() routeID:number = 0;

  routesData:OrderInformation | undefined;
  transporter:transporterInformation | undefined;
  collabotor:CollaboratorInformation | undefined;
  routerAux:number = 0;
  formattedDate: string | undefined = undefined;


  // Cuadro de diálogo de confirmación
  mostrarDialogo = false;
  mensaje = '';
  confirmCallback: (() => void) | null = null;

  docTypeselect: any[] = [
    { id: 0, name: 'CC' },
    { id: 1, name: 'TI' },
    { id: 2, name: 'CE' },
    { id: 3, name: 'NIT' },
  ];

  bankAccountTypeselect: any[] = [
    { id: 0, name: 'Cuenta de ahorros' },
    { id: 1, name: 'Corriente' },
  ];

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

  constructor(private service: AsociacionService, private router: Router, private datePipe: DatePipe) {
    
  }

  cerrarTodo() {
    this.cerrarModal.emit();
    this.rutasVisible = false;
    this.routesData = undefined;
    this.transporter = undefined;
    this.collabotor = undefined;
  }

  ngOnChanges(): void {
    if (this.rutasVisible === true) {
      if (this.managementFlag === true) {
        console.log("en el modal los datos son: ", this.routeID);
        this.service.getRoute(this.routeID).subscribe(route => {
          if (route['state'] === 'Fail') {
            console.log("No se encontraron detalles de la orden ", route);        
          } else {
            this.routesData = route.data[0];
            this.routerAux = route.data[0].routeID;
            console.log("Detalles de la orden: ", this.routesData);
          }
        });
      }
      if (this.managementFlag === false) {
        console.log("Crear rutaaaaaaaaa");
      }
    }
  }

  removeOrderFromRoute(orderID:number){
    console.log(orderID);
    this.service.removeOrderFromRoute(orderID).subscribe(result => {
      if (result['state'] === 'Fail') {
        console.log("No se legro eliminar la orden de la ruta ", result);
      } else {
        console.log("Orden eliminada correctamente");
      }
    });
  }

  // Gestion de rutas
  routesManagementVisible:boolean = false;
  actionFilter:number = 0;

  openRoutesManagement(actionFilter:number) {
    this.routesManagementVisible = true;
    this.actionFilter = actionFilter;
  }

  closeRoutesManagement() {
    this.routesManagementVisible = false;
  }

  obtenerTransportador(transporter:transporterInformation){
    console.log("transportador seleccionado: ",transporter);
    this.transporter = transporter;
  }

  obtenerColaborador(collabotor:CollaboratorInformation){
    console.log("colaborador seleccionado: ",collabotor);
    this.collabotor = collabotor;
  }

  crearRuta(){
    const currentDate = new Date();
    this.formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd')!;
    console.log("Crear rutaaaaaaaaa y la fecha ", this.formattedDate);
    this.service.createRoute(this.transporter?.transID, this.transporter?.vehID, this.collabotor?.collabID, this.formattedDate).subscribe(result => {
      if (result['state'] === 'Fail') {
        console.log("No se logro crear la ruta ", result);
      } else {
        console.log("Se logro crear la ruta ", result.data);
      }
    });
  }


}
