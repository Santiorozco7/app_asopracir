import { Component, Input, Output, EventEmitter, HostListener, untracked, OnChanges, SimpleChanges } from '@angular/core';
import { ColaboradorService } from '../../colaborador.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnChanges {
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() cerrarActualizar = new EventEmitter<void>();
  @Input() modalVisible: boolean = false;
  @Input() orderID: string = "";
  orderIDtemp:string = "";
  stateFlag:boolean = true;

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    // Aquí puedes realizar cualquier acción que desees antes de que la página se recargue o cierre
    // Por ejemplo, puedes llamar a un método de tu servicio para realizar alguna tarea de limpieza
    const orderID = this.orderID !== "" ? this.orderID : undefined;
    const orderIDString = orderID !== undefined ? orderID : "";
    console.log(orderIDString);
    if (this.stateFlag) {
      this.service.updateOrder(orderIDString, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '2').subscribe(result => {
        if (result['state'] === 'Ok') {
          console.log('Se actualizo la orden a 2', result);
        } else if (result['state'] === 'Fail') {
          console.log('No se pudo actualizar la orden', result);
        }
      });
    }
    console.log('La página se está recargando o cerrando...');
  }

  cerrar() {
    const orderID = this.orderID !== "" ? this.orderID : undefined;
    const orderIDString = orderID !== undefined ? orderID : "";
    console.log(orderIDString);
    this.service.updateOrder(orderIDString, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '2').subscribe(result => {
      if (result['state'] === 'Ok') {
        console.log('Se actualizo la orden a 2', result);
      } else if (result['state'] === 'Fail') {
        console.log('No se pudo actualizar la orden', result);
      }
    });
    this.cerrarModal.emit();
    this.cerrarActualizar.emit();
  }

  platanos: number[] = [];
  nuevoPeso?: number;
  precioPorKilo?: number;
  sumaPlatanos?: number;
  precioPlatano?: number;

  platanosCalidad: number[] = [];
  nuevoPesoCalidad?: number;
  precioPorKiloCalidad?: number;
  sumaPlatanosCalidad?: number;
  precioPlatanoCalidad?: number;

  editFlag: boolean = false;
  // startFlag: boolean = true;
  encargado: string = "";

  constructor(private service: ColaboradorService) {}

  View(){
    // if (this.orderID !== "" || this.orderID !== this.orderIDtemp) {
      
    // }
    this.service.getPrice().subscribe(price => {
      if (price['state'] === 'Ok') {
        this.precioPorKilo = price.data.price1;
        this.precioPorKiloCalidad = price.data.price2;
        console.log('Se obtuvo el precio',price);
      } else if (price['state'] === 'Fail') {
        console.log('No se obtuvo el precio',price);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Verificar si hay un cambio en la variable orderID
    if (changes['orderID'] && !changes['orderID'].firstChange) {
      console.log("Se actualizo toda la informacion");
      this.orderIDtemp = this.orderID;
      this.platanos = [];
      this.nuevoPeso = undefined;
      this.precioPorKilo = undefined;
      this.sumaPlatanos = undefined;
      this.precioPlatano = undefined;

      this.platanosCalidad = [];
      this.nuevoPesoCalidad = undefined;
      this.precioPorKiloCalidad = undefined;
      this.sumaPlatanosCalidad = undefined;
      this.precioPlatanoCalidad = undefined;

      this.encargado = "";
      this.stateFlag = true;
    }
  }

  agregarPeso(indexCalidad: number) {
    if (indexCalidad === 1) {
      if (this.nuevoPeso !== undefined && this.nuevoPeso > 0) {
        this.platanos.push(this.nuevoPeso);
        this.nuevoPeso = undefined; // Resetear el valor del nuevo peso después de agregarlo
      }
    }
    if (indexCalidad === 2) {
      if (this.nuevoPesoCalidad !== undefined && this.nuevoPesoCalidad > 0) {
        this.platanosCalidad.push(this.nuevoPesoCalidad);
        this.nuevoPesoCalidad = undefined; // Resetear el valor del nuevo peso después de agregarlo
      }
    }
  }

  eliminarPeso(index: number, indexCalidad: number) {
    if (indexCalidad === 1) {
      this.platanos.splice(index, 1);
    }
    if (indexCalidad === 2) {
      this.platanosCalidad.splice(index, 1);
    }
  }

  calcularSumaPlatanos(): number {
    this.sumaPlatanos = this.platanos.reduce((acc, peso) => acc + peso, 0);
    return this.sumaPlatanos;
  }

  
  calcularSumaPlatanosCalidad(): number {
    this.sumaPlatanosCalidad = this.platanosCalidad.reduce((acc, peso) => acc + peso, 0);
    return this.sumaPlatanosCalidad;
  }

  calcularPrecioTotal(): number {
    if (this.precioPorKilo !== undefined) {
      this.precioPlatano = this.calcularSumaPlatanos() * this.precioPorKilo;
      return this.precioPlatano;
    }
    return 0;
  }
  
  calcularPrecioTotalCalidad(): number {
    if (this.precioPorKiloCalidad !== undefined) {
      this.precioPlatanoCalidad = this.calcularSumaPlatanosCalidad() * this.precioPorKiloCalidad;
      return this.precioPlatanoCalidad;
    }
    return 0;
  }

  editPickup(){
    this.editFlag = !this.editFlag;
  }

  // startPickup(){
  //   this.startFlag = false;
  // }

  finish(){
    // console.log(this.orderID);
    const sumaPlatanosString = this.sumaPlatanos !== undefined ? this.sumaPlatanos.toString() : undefined;
    const sumaPlatanosCalidadString = this.sumaPlatanosCalidad !== undefined ? this.sumaPlatanosCalidad.toString() : undefined;
    const platanosLengthString = this.platanos.length.toString();
    const platanosCalidadLengthString = this.platanosCalidad.length.toString();
    const precioTotal = this.precioPlatano !== undefined && this.precioPlatanoCalidad !== undefined ? (this.precioPlatano + this.precioPlatanoCalidad).toString() : undefined;
    console.log(this.orderID,' ', sumaPlatanosString,' ', sumaPlatanosCalidadString,' ', platanosLengthString,' ', platanosCalidadLengthString,' ', precioTotal, ' ', this.encargado)
    this.service.updateOrder(this.orderID, sumaPlatanosString, sumaPlatanosCalidadString, platanosLengthString, platanosCalidadLengthString, precioTotal, undefined, this.encargado, '4').subscribe(result => {
      if (result['state'] === 'Ok') {
        console.log('Se actualizo la orden',result);
        this.stateFlag = false;
        this.cerrarModal.emit();
        this.cerrarActualizar.emit();
      } else if (result['state'] === 'Fail') {
        console.log('No se pudo actualizar la orden',result);
      }
    });
}
}
