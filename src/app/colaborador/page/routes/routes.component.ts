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
  startRouteFlag: boolean = false;

  infoStartWeight = this.formBuilder.group({
    startWeight: ["", [Validators.required]]
  })

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
        console.log(routes.data[0]);
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
    // this.service.getRoute(routeID).subscribe(r => {
    //   console.log(r.data);
    // });
  }

  startRoute(routeID:string, index:number){
    if (index === 0) {
      console.log(routeID);
      this.startRouteFlag = true;
    } else if (index === 1) {
      const startWeight:string = this.infoStartWeight.value.startWeight || "";
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
          console.log('Se inicio la ruta',resultStart);
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
  }



  modalVisible: boolean = false;
  showOrderForm(orderID:string){
    console.log(orderID);
    this.orderID = orderID;
    this.price();
    this.modalVisible = true;
    this.service.updateOrder(orderID, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '3').subscribe(result => {
      if (result['state'] === 'Ok') {
        console.log('Se actualizo la orden',result);
      } else if (result['state'] === 'Fail') {
        console.log('No se pudo actualizar la orden',result);
      }
    });
  }
  closeOrderForm(){
    this.modalVisible = false;
  }
}
