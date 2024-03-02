import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';

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

  constructor(private formBuilder: FormBuilder, private service: AsociacionService, private router: Router) {
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
      if (orders['state'] === 'Fail') {
        // this.router.navigate(['/']);
        console.log(orders);
      } else {
        this.orders = orders.data;
      console.log(orders.data);
      this.service.getPendingTapes(this.months).subscribe(tapes => {
        if (tapes['state'] === 'Ok') {
          this.tapes = tapes.data;
          console.log("Futuras cosechas", this.tapes);
          this.service.getOrders(this.filter).subscribe(ordersFilter => {
            if (ordersFilter['state'] === 'Ok') {
              this.ordersFilter = ordersFilter.data;
              console.log("Filtro de ordenes", this.ordersFilter);
            }
          })
        }
      })
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
