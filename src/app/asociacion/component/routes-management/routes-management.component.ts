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

  constructor(private service: AsociacionService, private router: Router) {
    
  }

  cerrarTodo() {
    this.actionFilter = 0;
    this.cerrarModal.emit();
  }

  ngOnChanges(): void {
    if (this.actionFilter === 1) { //Transportadores
      this.transportersFlag = true;
      this.collaboratorsFlag = false;
      this.ordersFlag = false;
      console.log("Entro a la accion 1");
      console.log("este es la routeID: ", this.routeID);
      this.service.getTransporters('active').subscribe(Transporters => {
        if (Transporters['state'] === 'Fail') {
          console.log("Transportadores no encontrados", Transporters);
        } else {
          this.transporters = Transporters.data;
          console.log(Transporters.data);
        }  
      });
    }
    if (this.actionFilter === 2) { //Colaboradores
      this.transportersFlag = false;
      this.collaboratorsFlag = true;
      this.ordersFlag = false;
      console.log("Entro a la accion 2");
      this.service.getCollaborators().subscribe(collabotors => {
        if (collabotors['state'] === 'Fail') {
          console.log("Transportadores no encontrados", collabotors);
        } else {
          this.collabotors = collabotors.data;
          console.log(collabotors.data);
        }  
      });
    }
    if (this.actionFilter === 3) { //Ordenes pendientes
      this.transportersFlag = false;
      this.collaboratorsFlag = false;
      this.ordersFlag = true;
      console.log("Entro a la accion 3");
      this.service.getPendingOrders().subscribe(orders => {
        if (orders['state'] === 'Fail') {
          console.log("No se encontraron ordenes pendientes ",orders);
        } else {
          this.orders = orders.data;
          console.log(orders.data);
        }  
      });
    }
  }

  // Actualizar transportador
  updateTransporter(transID:number, vehID:number, transporter:transporterInformation){
    if (this.managementFlag === true) {
      console.log(this.routeID," ",transID," ",vehID);
      this.service.updateRoute(this.routeID, undefined, undefined, undefined, undefined, transID, vehID, undefined).subscribe(updateTransporter => {
        if (updateTransporter['state'] === 'Fail') {
          console.log("No se logro actualizar ", updateTransporter);
        } else {
          console.log("Se logro actualizar");
          this.cerrarTodo();
        }
      });
    }
    if (this.managementFlag === false) {
      console.log("Guarda los datos en una variable", transporter);
      this.transporter.emit(transporter);
      this.cerrarTodo();
    }
    
  }

  // Actualizar Colaborador
  updateCollabotor(collabID:number, collabotor:CollaboratorInformation){
    if (this.managementFlag === true) {
      console.log(this.routeID," ",collabID);
      this.service.updateRoute(this.routeID, undefined, undefined, undefined, undefined, undefined, undefined, collabID).subscribe(updateTransporter => {
        if (updateTransporter['state'] === 'Fail') {
          console.log("No se logro actualizar ", updateTransporter);
        } else {
          console.log("Se logro actualizar");
          this.cerrarTodo();
        }
      });      
    }
    if (this.managementFlag === false) {
      console.log("Guarda los datos en una variable", collabotor);
      this.collabotor.emit(collabotor);
      this.cerrarTodo();
    }
  }

  // Agregar la orden a la ruta
  addOrderToRoute(orderID:number){
    console.log(this.routeID," ",orderID);
    this.service.appendOrderToRoute(this.routeID, orderID).subscribe(order => {
      if (order['state'] === 'Fail') {
        console.log("No se logro asignar la orden a la ruta ",order);
      } else {
        console.log("Se agrego a la ruta ", order.data);
        this.cerrarTodo();
      }
    });
  }

}
