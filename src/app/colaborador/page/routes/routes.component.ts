import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ColaboradorService } from '../../colaborador.service';
import { OrderFormComponent } from '../../component/order-form/order-form.component';

interface OrderInformation {
  collab: {
    docNumber: string;
    docType: string;
    email: string;
    firstLastname: string;
    names: string;
    phoneNumber: string;
  };
  orders: Array<{
    GPSposition: string;
    farmID: string;
    farmName: string;
    name: string; // Nombre completo del cliente
    numBunches: string;
    orderID: string;
    phoneNumber: string; // Número de teléfono del cliente
    startDate: string; // Fecha de inicio
    state: string;
    zoneName: string;
  }>;
  pickupDate: string;
  plate: string;
  routeID: string;
  routeState: string;
  totalBunches: string;
  transporter: {
    docNumber: string;
    docType: string;
    email: string;
    firstLastname: string;
    names: string;
    phoneNumber: string;
  };
  vehState: string;
  vehType: string;
}

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent {
  @ViewChild(OrderFormComponent) orderFormComponent!: OrderFormComponent;
  routes: OrderInformation[] = [];
  fechaActual: Date = new Date();
  fechaActualFormato: string = "";
  orderID:string = "";
  alertFlag: boolean = false;
  endFlag: boolean = false;
  alertendflag: boolean = false;
  alertendendflag: boolean = false;
  startRouteFlag: boolean = false;
  orderWithState2:boolean = false;

  startWeight: number = 0;
  endWeight: number = 0;

  // infoStartWeight = this.formBuilder.group({
  //   startWeight: ["", [Validators.required]]
  // })

  // infoFinishWeight = this.formBuilder.group({
  //   endWeight: ["", [Validators.required]]
  // })

  constructor(private formBuilder: FormBuilder, private service: ColaboradorService, private router: Router) {}

  ngOnInit(): void {
    this.View(this.fechaActual);
  }

  View(fechaActual: Date) {
    this.startRouteFlag = false;
    console.log(fechaActual);
    this.fechaActualFormato = `${fechaActual.getFullYear()}-${fechaActual.getMonth() + 1}-${fechaActual.getDate()}`;
    console.log(this.fechaActualFormato);
    this.service.getRoutes(undefined, this.fechaActualFormato, this.fechaActualFormato, undefined, undefined).subscribe(routes => {
      if (routes['state'] === 'Ok') {
        // console.log(routes.data);
        this.routes = routes.data;
        this.alertFlag = false;
        this.endFlag = false;
        this.alertendflag = false;
        this.alertendendflag = false;
        this.orderWithState2 = false;
        console.log(routes.data[0]);
        const orderWithState2 = routes.data[0].orders.find((order: OrderInformation['orders'][0]) => order.state === '2');
        if (orderWithState2) {
          this.orderWithState2 = true;
          console.log('Se encontró una orden con state igual a 2:', this.orderWithState2);
          // Realizar la acción que necesites para esta orden
        } else {
          this.orderWithState2 = false;
          console.log('No se encontró una orden con state igual a 2.', this.orderWithState2);
        }
      } else if ((routes['state'] === 'Fail') && (routes['sessionStatus'] !== 'Session expired')) {
        this.alertFlag = true;
        console.log('No se encontraron rutas',routes);
      } else if ((routes['state'] === 'Fail') && (routes['sessionStatus'] === 'Session expired')) {
        this.router.navigate(['/']);
        console.log('No se encontraron rutas',routes);
      }
    });
  }

  price(): void {
    if (this.orderFormComponent) {
      this.orderFormComponent.View();
    }
  }

  aumentarDia() {
    this.fechaActual = new Date(this.fechaActual.getTime() + 86400000); // Añade un día (86400000 milisegundos)
    this.View(this.fechaActual);
  }

  disminuirDia() {
    this.fechaActual = new Date(this.fechaActual.getTime() - 86400000); // Resta un día (86400000 milisegundos)
    this.View(this.fechaActual);
  }

  cancelRoute(routeID:string){
    console.log(routeID);
    this.service.cancelRoute(routeID).subscribe(cancel => {
      if (cancel['state'] === 'Ok') {
        console.log('Se cancelo la ruta',cancel);
      } else if (cancel['state'] === 'Fail') {
        this.alertFlag = true;
        console.log('No se pudo cancelar',cancel);
      }
    });
  }

  endRoute(){
    if (this.orderWithState2) {
      console.log("entro a la bandera");
      this.alertendflag = true;
      this.alertendendflag = false;
    } else {
      this.alertendflag = false;
      this.alertendendflag = true;
    }
  }

  nextendRoute(){
    this.alertendflag = false;
    this.alertendendflag = true;
  }

  end2Route(routeID:string){
    console.log(routeID, ' ', this.endWeight);
    if (this.endWeight !== undefined && this.endWeight > 0) {
      this.service.updateRoute(routeID, undefined, undefined, this.endWeight.toString(), "2", undefined, undefined).subscribe(result => {
        if (result['state'] === 'Ok') {
          console.log('Se cancelo la ruta',result);
          this.ngOnInit();
        } else if (result['state'] === 'Fail') {
          this.alertFlag = true;
          console.log('No se pudo cancelar',result);
        }
      });
      if (this.orderWithState2) {
        this.service.purgeRoute(routeID).subscribe(resultCancel => {
          if (resultCancel['state'] === 'Ok') {
            console.log('Se cancelo la ruta',resultCancel);
          } else if (resultCancel['state'] === 'Fail') {
            this.alertFlag = true;
            console.log('No se pudo cancelar',resultCancel);
          }
        });
      }
    }
  }

  startRoute(routeID:string, index:number){
    if (index === 0) {
      console.log(routeID);
      this.startRouteFlag = true;
    } else if (index === 1) {
      const startWeight:string = this.startWeight.toString();
      console.log(startWeight);
      this.service.updateRoute(routeID, undefined, startWeight, undefined, '1', undefined, undefined, undefined).subscribe(result => {
        if (result['state'] === 'Ok') {
          console.log('Se actualizo la ruta',result);
        } else if (result['state'] === 'Fail') {
          console.log('No se pudo actualizar la ruta',result);
        }
      });
      this.service.startRoute(routeID).subscribe(resultStart => {
        if (resultStart['state'] === 'Ok') {
          console.log('Se inicio la ruta',resultStart, startWeight);
        } else if (resultStart['state'] === 'Fail') {
          console.log('No se pudo iniciar la ruta',resultStart);
        }
      });
      this.View(this.fechaActual);
      this.startRouteFlag = false;
    } else {
      console.log("No se pudo iniciar la ruta");
    }
  }

  cancelStartRoute(){
    this.startRouteFlag = false;
    this.alertendflag = false;
    this.alertendendflag = false;
  }

  mostrarTodos: boolean = false;
  svgIcon: string = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>';

  toggleVerTodos() {
    this.mostrarTodos = !this.mostrarTodos;
  }

  modalVisible: boolean = false;
  showOrderForm(orderID:string){
    console.log(orderID);
    this.orderID = orderID;
    this.price();
    this.modalVisible = true;
    this.service.updateOrder(orderID, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '3').subscribe(result => {
      if (result['state'] === 'Ok') {
        console.log('Se actualizo la orden a 3',result);
      } else if (result['state'] === 'Fail') {
        console.log('No se pudo actualizar la orden',result);
      }
    });
  }
  closeOrderForm(){
    this.modalVisible = false;
  }
}
