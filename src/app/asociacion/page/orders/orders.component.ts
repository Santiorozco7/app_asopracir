import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  orders: any[] = [];
  tapes: any[] = [];
  ordersFilter: any[] = [];
  tapesAlert:boolean = false;
  ordersAlert:boolean = false;
  pendingsAlert:boolean = false;
  filterValue:string = "pendientes";

  months:number = 1;
  filter:number = 0;
  selectedValueAux:number = 0;

  filterUser = this.formBuilder.group({
    state: ['pendientes'] 
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

  constructor(private formBuilder: FormBuilder, private service: AsociacionService, private router: Router, private authService: AuthService) {
    this.filterUser.valueChanges.subscribe(() => {
      this.filterValue = this.filterUser.value.state ?? 'pendientes';
      console.log(this.filterValue);
      this.View();
    });
    // Llama a la funciones con los valores iniciales
    this.month({ target: { value: this.months } });
    this.onSelectFilter({ target: { value: this.selectedValueAux } });
  }

  ngOnInit(): void{
    this.View();
  }

  View() {
    this.service.getPendingOrders().subscribe(orders => {
      if (orders['state'] === 'Ok') {
        this.orders = orders.data;
        console.log(orders.data);
        this.pendingsAlert = false;
        this.service.getPendingTapes(this.months).subscribe(tapes => {
          if (tapes['state'] === 'Ok') {
            this.tapes = tapes.data;
            console.log("Futuras cosechas", this.tapes);
            this.tapesAlert = false;
            this.service.getOrders(this.filter).subscribe(ordersFilter => {
              if (ordersFilter['state'] === 'Ok') {
                this.ordersAlert = false;
                this.ordersFilter = ordersFilter.data;
                console.log("Filtro de ordenes", this.ordersFilter);
              } else if ((ordersFilter['state'] === 'Fail') && (ordersFilter['sessionStatus'] !== 'Session expired')) {
                this.ordersAlert = true;
                console.log("No hay ordenes asociadas en el filtro para mostrar", ordersFilter);
              } else if ((ordersFilter['state'] === 'Fail') && (ordersFilter['sessionStatus'] === 'Session expired')) {
                this.router.navigate(['/']);
                console.log('No hay session',ordersFilter);
              }
            })
          } else if ((tapes['state'] === 'Fail') && (tapes['sessionStatus'] !== 'Session expired')) {
            this.tapesAlert = true;
            console.log("No hay cintas pendientes para mostrar", tapes);
          } else if ((tapes['state'] === 'Fail') && (tapes['sessionStatus'] === 'Session expired')) {
            this.router.navigate(['/']);
            console.log('No hay session',orders);
          }
        })
      } else if ((orders['state'] === 'Fail') && (orders['sessionStatus'] !== 'Session expired')) {
        console.log("No hay ordenes para mostrar", orders);
        this.pendingsAlert = true;
      } else if ((orders['state'] === 'Fail') && (orders['sessionStatus'] === 'Session expired')) {
        this.authService.logout();
        this.router.navigate(['/']);
        console.log('No hay session',orders);
      }
    });
  }

  month(event: any) {
    const selectedMonth = event.target.value; // Obtiene el valor seleccionado
    this.months = selectedMonth;
    this.service.getPendingTapes(this.months).subscribe(tapes => {
      if (tapes['state'] === 'Ok') {
        this.tapes = tapes.data;
        console.log("Futuras cosechas", this.tapes);
        this.tapesAlert = false;
      } if (tapes['state'] === 'Fail') {
        this.tapes = tapes.data;
        console.log("Futuras cosechas", this.tapes);
        this.tapesAlert = true;
      }
    })
  }

  onSelectFilter(event: any) {
    const selectedValue = event.target.value; // Obtiene el valor seleccionado
    this.selectedValueAux = selectedValue;
    console.log('Valor seleccionado:', selectedValue);
    this.service.getOrders(selectedValue).subscribe(ordersFilter => {
      if (ordersFilter['state'] === 'Ok') {
        this.ordersFilter = ordersFilter.data;
        console.log("Filtro de ordenes", this.ordersFilter);
        this.ordersAlert = false;
      } if (ordersFilter['state'] === 'Fail') {
        this.ordersFilter = ordersFilter.data;
        console.log("Filtro de ordenes no encontrada", this.ordersFilter);
        this.ordersAlert = true;
      }
    })
  }

  // Función para crear la orden.
  generateOrder(farmID:number, tapeID:number) {
    console.log(farmID, "  ", tapeID);
    this.service.createOrder(farmID, tapeID).subscribe(result => {
      if (result['state'] === 'Ok') {
        console.log("Se creo la orden");
        this.View();
      } else {
        console.log("No se creo la orden", result);
      }
    })
  }

  



  // Modal -----------------------------------------------------------
  agendarVisible = false;
  modalData: { numeroDocumento?: number, tipoDocumento?: number, placa?: string} = {};

  mostrarModal(numeroDocumento?: number, tipoDocumento?: number, placa?: string) {
    this.modalData = { numeroDocumento, tipoDocumento, placa };
    // console.log(this.modalData.numeroDocumento, this.modalData.tipoDocumento);
    this.agendarVisible = true;
  }

  cerrarModal() {
    this.agendarVisible = false;
  }

  //Modal para crear vehículo -------------------------------------------
  createVehicleVisible:boolean = false;

  mostrarcreateVehicle() {
    // console.log(this.modalData.numeroDocumento, this.modalData.tipoDocumento);
    this.createVehicleVisible = true;
  }

  cerrarcreateVehicleVisible() {
    this.createVehicleVisible = false;
  }

  //Modal para ver la orden ---------------------------------------------
  seeOrderVisible:boolean = false;
  seeOrderID:number = 0;

  seeOrder(orderID:number) {
    this.seeOrderID = orderID;
    console.log("Esta es la orden; ", orderID)
    this.seeOrderVisible = true;
  }

  cerrarseeOrder() {
    this.seeOrderVisible = false;
  }

  //Modal agregar ruta ----------------------------------------------------
  addRuteVisible:boolean = false;
  addOrderID:number = 0;

  addRoute(orderID:number){
    this.addOrderID = orderID;
    this.addRuteVisible = true;
  }

  cerrarAddRoute(){
    this.addRuteVisible = false;
    this.View();
  }
}
