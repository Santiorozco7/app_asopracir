import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ColaboradorService } from '../../colaborador.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent {
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() cerrarActualizar = new EventEmitter<void>();
  @Input() modalVisible: boolean = false;
  @Input() orderID: string = "";

  cerrar() {
    this.cerrarModal.emit();
    this.cerrarActualizar.emit();
  }

  platanos: number[] = [];
  nuevoPeso?: number;
  precioPorKilo?: number;

  platanosCalidad: number[] = [];
  nuevoPesoCalidad?: number;
  precioPorKiloCalidad?: number;

  editFlag: boolean = false;
  startFlag: boolean = true;
  encargado: string = "";

  constructor(private service: ColaboradorService) {}

  // ngOnInit(): void {
  //   console.log("Se ejecuto en el componente de carga")
  //   this.View();
  // }

  View(){
    this.service.getPrice().subscribe(price => {
      if (price['state'] === 'Ok') {
        this.precioPorKilo = price.data.price1;
        this.precioPorKiloCalidad = price.data.price2;
        console.log('Se obtuvo el precio',price);
      } else if (price['state'] === 'Fail') {
        console.log('No se obtuvo el precio',price);
      }
    })
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
    return this.platanos.reduce((acc, peso) => acc + peso, 0);
  }

  
  calcularSumaPlatanosCalidad(): number {
    return this.platanosCalidad.reduce((acc, peso) => acc + peso, 0);
  }

  calcularPrecioTotal(): number {
    if (this.precioPorKilo !== undefined) {
      return this.calcularSumaPlatanos() * this.precioPorKilo;
    }
    return 0;
  }
  
  calcularPrecioTotalCalidad(): number {
    if (this.precioPorKiloCalidad !== undefined) {
      return this.calcularSumaPlatanosCalidad() * this.precioPorKiloCalidad;
    }
    return 0;
  }

  editPickup(){
    this.editFlag = !this.editFlag;
  }

  startPickup(){
    this.startFlag = false;
  }

  finish(){
    console.log(this.orderID);
    this.service.updateOrder(this.orderID, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '3').subscribe(result => {
      if (result['state'] === 'Ok') {
        console.log('Se actualizo la orden',result);
      } else if (result['state'] === 'Fail') {
        console.log('No se pudo actualizar la orden',result);
      }
    });
  }

}
