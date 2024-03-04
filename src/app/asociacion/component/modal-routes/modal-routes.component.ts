import { Component, Input, Output, EventEmitter} from '@angular/core';
import { AsociacionService } from '../../asociacion.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { state } from '@angular/animations';

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

  showConfirmationModal: boolean = false;
  updateDate: boolean = false;

  edit:boolean = false;

  // Cuadro de diálogo de confirmación
  mostrarDialogo = false;
  
  showDialog = false;
  positiveNotification = true;
  message = '';
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

  pickupDate: string | undefined = undefined;

  constructor(private formBuilder: FormBuilder, private service: AsociacionService, private router: Router, private datePipe: DatePipe) {  }

  closeNotification(): void {
    this.showDialog = false;
  }

  getTransporterName(): string {
    if (this.managementFlag) {
      return (this.routesData?.transporter?.names && this.routesData?.transporter?.firstLastname) ? 
        `${this.routesData?.transporter?.names} ${this.routesData?.transporter?.firstLastname}` : 
        'por definir';
    } else {
      return (this.transporter?.names && this.transporter?.firstLastname) ? 
        `${this.transporter?.names} ${this.transporter?.firstLastname}` : 
        'por definir';
    }
  }
  getTransporterPlate(): string {
    return this.managementFlag ? this.routesData?.plate || 'por definir' : this.transporter?.plate || 'por definir';
  }
  getTransporterPhone(): string {
    return (this.managementFlag ? this.routesData?.transporter?.phoneNumber : this.transporter?.phoneNumber)?.toString() || 'por definir';
  }
  getPickupDate(): string {
    return this.managementFlag ? (this.routesData?.pickupDate || '0000-00-00') : '0000-00-00';
  }
  
  getCollabName(): string {
    if (this.managementFlag) {
      return (this.routesData?.collab?.names && this.routesData?.collab?.firstLastname) ? 
        `${this.routesData?.collab?.names} ${this.routesData?.collab?.firstLastname}` : 
        'por definir';
    } else {
      return (this.collabotor?.names && this.collabotor?.firstLastname) ? 
        `${this.collabotor?.names} ${this.collabotor?.firstLastname}` : 
        'por definir';
    }
  }
  getCollabPhone(): string {
    return (this.managementFlag ? this.routesData?.collab?.phoneNumber : this.collabotor?.phoneNumber)?.toString() || 'por definir';
  }

  cerrarTodo() {
    this.cerrarModal.emit();
    this.rutasVisible = false;
    this.routesData = undefined;
    this.transporter = undefined;
    this.collabotor = undefined;
    this.updateDate = false;
  }

  ngOnChanges(): void {
    if (this.rutasVisible === true) {
      if (this.managementFlag === true) {
        console.log("en el modal los datos son: ", this.routeID);
        this.service.getRoute(this.routeID).subscribe(route => {
          if (route['state'] === 'Ok'){
            this.routesData = route.data[0];
            console.log("Detalles de la orden: ", this.routesData);
            console.log("state", this.routesData?.routeState)
            this.edit = this.routesData?.routeState === '0';
            console.log(this.edit)
          } else if (route['state'] === 'Fail') {
            console.log("No se encontraron detalles de la orden ", route);        
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
        this.showDialog = true;
        this.positiveNotification = false;
        this.message = 'no se ha podido eliminar, comprueba nuevamente';
      } else {
        console.log("Orden eliminada correctamente");
        this.showDialog = true;
        this.positiveNotification = true;
        this.message = `Se ha eliminado la órden`;
        this.ngOnChanges();
      }
    });
  }

  onSubmit() {
      console.log('Actualiza fecha de ruta');
      if ((this.routesData?.routeID !== undefined) && this.pickupDate) {
          this.service.updateRoute(this.routesData.routeID, this.pickupDate, undefined, undefined, undefined, undefined, undefined, undefined).subscribe(updateTransporter => {
            if (updateTransporter['state'] === 'Ok') {
              console.log("Se logró actualizar");      
              this.showDialog = true;
              this.positiveNotification = true;
              this.message = `La fecha ha sido actualizada`;
            } else if (updateTransporter['state'] === 'Fail') {      
              this.showDialog = true;
              this.positiveNotification = false;
              this.message = `No se ha sido actualizada`;
              console.log("No se logró actualizar ", updateTransporter);
            } 
          });
      } else {
          console.log("No se puede actualizar: routeID no está definido");
      }
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
    this.ngOnChanges();
  }

  obtenerTransportador(transporter:transporterInformation){
    console.log("transportador seleccionado: ",transporter);
    this.transporter = transporter;
  }

  obtenerColaborador(collabotor:CollaboratorInformation){
    console.log("colaborador seleccionado: ",collabotor);
    this.collabotor = collabotor;
  }

  createRoute() {
    if (this.pickupDate) {
      this.pickupDate = this.pickupDate;
    } else {
      // Manejar el caso en que el valor sea null o undefined
      console.error('El valor de la fecha es nulo o no está definido.');
    }
    console.log("Crear ruta y la fecha ", this.pickupDate);
    this.showConfirmationModal = true;
  }
  
  createRouteConfirmed() {
    this.service.createRoute(this.transporter?.transID, this.transporter?.vehID, this.collabotor?.collabID, this.pickupDate).subscribe(result => {
      if (result['state'] === 'Ok') {
        console.log("Se logró crear la ruta ", result.data);
        this.showDialog = true;
        this.positiveNotification = true;
        this.message = `Se ha creado la ruta`;
      } else if (result['state'] === 'Fail') {
        console.log("No se logró crear la ruta ", result);
        this.showDialog = true;
        this.positiveNotification = false;
        this.message = `No se ha podido crear la ruta`;
      }
    });
    this.showConfirmationModal = false;
    this.cerrarTodo();
  }
}
