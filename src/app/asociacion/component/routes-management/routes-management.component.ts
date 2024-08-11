import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';

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

interface OrderDetails {
  GPSposition: string;
  city: string;
  email: string;
  estBunches: string;
  farmID: number;
  farmName: string;
  firstLastname: string;
  names: string;
  orderDate: string;
  orderID: number;
  phoneNumber: number;
  userID: number;
  zoneName: string;
}

@Component({
  selector: 'app-routes-management',
  templateUrl: './routes-management.component.html',
  styleUrls: ['./routes-management.component.css']
})
export class RoutesManagementComponent {
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() cerrarActualizar = new EventEmitter<void>();
  @Output() transporter = new EventEmitter<transporterInformation>();
  @Output() collabotor = new EventEmitter<CollaboratorInformation>();
  @Input() routesManagementVisible: boolean = false;
  @Input() managementFlag:boolean = false;
  @Input() actionFilter:number = 0;
  @Input() routeID:number = 0;

  transporters: transporterInformation[] = [];
  collabotors: CollaboratorInformation[] = [];
  orders: OrderDetails[] = [];
  transportersFlag:boolean = false;
  collaboratorsFlag:boolean = false;
  ordersFlag:boolean = false;
  ordersAlert:boolean = false;

  // Cuadro de diálogo de confirmación
  mostrarDialogo = false;

  showDialog = false;
  positiveNotification = true;
  message = '';
  confirmCallback: (() => void) | null = null;

  docTypeselect: any[] = [
    { id: 0, name: 'Cédula de ciudadanía' },
    { id: 1, name: 'Tarjeta de Identidad' },
    { id: 2, name: 'Cédula de Extranjería' },
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

  typeSelect: { [key: string]: string } = {
    0: 'Sencillo',
    1: 'Camioneta estacas',
    2: 'Camioneta platón',
    3: 'Turbo',
    4: 'Furgoneta',
    5: 'Dobletroque',
    6: 'Minimula',
    7: 'Tractomula',
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
    if (this.actionFilter === 1) { //Transportadores
      this.transportersFlag = true;
      this.collaboratorsFlag = false;
      this.ordersFlag = false;
      this.service.getTransporters('active').subscribe(Transporters => {
        if (Transporters['state'] === 'Fail') {
        } else {
          this.transporters = Transporters.data;
        }  
      });
    }
    if (this.actionFilter === 2) { //Colaboradores
      this.transportersFlag = false;
      this.collaboratorsFlag = true;
      this.ordersFlag = false;
      this.service.getCollaborators().subscribe(collabotors => {
        if (collabotors['state'] === 'Fail') {
        } else {
          this.collabotors = collabotors.data;
        }  
      });
    }
    if (this.actionFilter === 3) { //Ordenes pendientes
      this.transportersFlag = false;
      this.collaboratorsFlag = false;
      this.ordersFlag = true;
      this.service.getPendingOrders().subscribe(orders => {
        if (orders['state'] === 'Ok') {
          this.orders = orders.data;
          this.ordersAlert = false;
        } else if (orders['state'] === 'Fail') {
          this.ordersAlert = true;
        } 
      });
    }
  }

  // Actualizar transportador
  updateTransporter(transID:number, vehID:number, transporter:transporterInformation){
    if (this.managementFlag === true) {
      this.service.updateRoute(this.routeID, undefined, undefined, undefined, undefined, transID, vehID, undefined).subscribe(updateTransporter => {
        if (updateTransporter['state'] === 'Ok') {
          this.showDialog = true;
          this.positiveNotification = true;
          this.message = `Se ha actualizado el transportador`;
          this.cerrarTodo();
        } else if (updateTransporter['state'] === 'Fail') {
          this.showDialog = true;
          this.positiveNotification = false;
          this.message = `ha ocurrido un error al actualizar`;
        } 
      });
    }
    if (this.managementFlag === false) {
      this.transporter.emit(transporter);
      this.cerrarTodo();
    }
    
  }

  // Actualizar Colaborador
  updateCollabotor(collabID:number, collabotor:CollaboratorInformation){
    if (this.managementFlag === true) {
      this.service.updateRoute(this.routeID, undefined, undefined, undefined, undefined, undefined, undefined, collabID).subscribe(updateTransporter => {
        if (updateTransporter['state'] === 'Ok'){
          this.showDialog = true;
          this.positiveNotification = true;
          this.message = `Se ha actualizado el colaborador`;
          this.cerrarTodo();
        } else if (updateTransporter['state'] === 'Fail') {
          this.showDialog = true;
          this.positiveNotification = false;
          this.message = `ha ocurrido un error al actualizar`;
        } 
      });      
    }
    if (this.managementFlag === false) {
      this.collabotor.emit(collabotor);
      this.cerrarTodo();
    }
  }

  // Agregar la orden a la ruta
  addOrderToRoute(orderID:number){
    this.service.appendOrderToRoute(this.routeID, orderID).subscribe(order => {
      if (order['state'] === 'Ok') {
        this.showDialog = true;
        this.positiveNotification = true;
        this.message = `Se ha agregado la órden`;
        this.cerrarTodo();
      } else if (order['state'] === 'Fail') {
        this.showDialog = true;
        this.positiveNotification = false;
        this.message = `No se ha podido agregar la órden`;
      } 
    });
  }
}
