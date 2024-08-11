import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';

interface orderData {
  order: {
  orderID: number;
  orderDate: string;
  routeID: number;
  farmID: number;
  weight: number;
  numBunches: number;
  estBunches: number;
  payAmount: number;
  payDate: string;
  signedBy: string;
  state: number;
  farmName: string;
  zoneName: string;
  city: string;
  userID: number;
  docType: number;
  docNumber: number;
  names: string;
  firstLastname: string;
  phoneNumber: number;
  email: string;
  };
  route: {
    pickupDate: string;
    routeState: number;
    plate: string;
    vehType: number;
    vehState: number;
    transporter: {
      docType: number;
      docNumber: number;
      names: string;
      firstLastname: string;
      phoneNumber: number;
      email: string;
    };
    collab: {
      docType: number;
      docNumber: number;
      names: string;
      firstLastname: string;
      phoneNumber: number;
      email: string;
    };
  };
}

@Component({
  selector: 'app-see-order',
  templateUrl: './see-order.component.html',
  styleUrls: ['./see-order.component.css']
})
export class SeeOrderComponent {

  @Output() cerrarModal = new EventEmitter<void>();
  @Output() cerrarActualizar = new EventEmitter<number>();
  @Input() seeOrderVisible: boolean = false;  
  @Input() orderID:number = 0;

  orderData:orderData[] = [];
  routeStateAUX:number = 0;

  // Cuadro de diálogo de confirmación
  mostrarDialogo = false;
  mensaje = '';
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

  constructor(private service: AsociacionService, private router: Router) {
    
  }

  cerrarTodo() {
    this.cerrarModal.emit();
  }

  ngOnChanges(): void {
    this.service.getOrder(this.orderID).subscribe(order => {
      if (order['state'] === 'Ok') {
        this.orderData = [order.data];
        if (order.data.route === null) {
          this.routeStateAUX = 0;
        } else {
          this.routeStateAUX = order.data.route.routeState;
        }
      } else {
      }
    })
  }

  updateOrder(state:number){
    if (state == 5) {
      this.service.updateOrder(this.orderData[0].order.orderID.toString(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, state.toString()).subscribe(result => {
        if (result['state'] === 'Ok') {
        } else if (result['state'] === 'Fail') {
        }
      });
    } else if (state == 6) {
      const fechaFormateada = this.getCurrentDateFormatted();
      this.service.updateOrder(this.orderData[0].order.orderID.toString(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, fechaFormateada, undefined, state.toString()).subscribe(result => {
        if (result['state'] === 'Ok') {
        } else if (result['state'] === 'Fail') {
        }
      });
    }
    this.cerrarModal.emit();
    this.cerrarActualizar.emit(state-1);
  }

  getCurrentDateFormatted(): string {
    // Configurar la zona horaria de Colombia (UTC-5)
    const colombiaTimeOffset = -5 * 60; // UTC-5 en minutos
    const localDate = new Date();
    
    // Obtener el tiempo UTC en milisegundos
    const utcTime = localDate.getTime() + (localDate.getTimezoneOffset() * 60000);

    // Ajustar el tiempo a la zona horaria de Colombia
    const colombiaDate = new Date(utcTime + (colombiaTimeOffset * 60000));

    const year = colombiaDate.getFullYear();
    const month = ('0' + (colombiaDate.getMonth() + 1)).slice(-2);
    const day = ('0' + colombiaDate.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }
}
