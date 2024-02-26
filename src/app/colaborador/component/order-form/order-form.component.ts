import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
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

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    // Aquí puedes realizar cualquier acción que desees antes de que la página se recargue o cierre
    // Por ejemplo, puedes llamar a un método de tu servicio para realizar alguna tarea de limpieza
    const orderID = this.orderID !== "" ? this.orderID : undefined;
    const orderIDString = orderID !== undefined ? orderID : "";
    console.log(orderIDString);
    this.service.updateOrder(orderIDString, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '2').subscribe(result => {
      if (result['state'] === 'Ok') {
        console.log('Se actualizo la orden', result);
      } else if (result['state'] === 'Fail') {
        console.log('No se pudo actualizar la orden', result);
      }
    });
    console.log('La página se está recargando o cerrando...');
  }
  
  firstQualityWeights: number[] = [];
  firstQualityPricePerKilo?: number;
  secondQualityWeights: number[] = [];
  secondQualityPricePerKilo?: number;
  
  newWeight?: number;
  selectedQuality: string = 'first'; 

  encargado: string = "";
  viewConfirmationModal: boolean = false;

  constructor(private service: ColaboradorService) {}

  View(){
    this.service.getPrice().subscribe(price => {
      if (price['state'] === 'Ok') {
        this.firstQualityPricePerKilo = price.data.price1;
        this.secondQualityPricePerKilo = price.data.price2;
        console.log('Se obtuvo el precio',price);
      } else if (price['state'] === 'Fail') {
        console.log('No se obtuvo el precio',price);
      }
    })
  }

  cerrar() {
    const orderID = this.orderID !== "" ? this.orderID : undefined;
    const orderIDString = orderID !== undefined ? orderID : "";
    console.log(orderIDString);
    this.service.updateOrder(orderIDString, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '2').subscribe(result => {
      if (result['state'] === 'Ok') {
        console.log('Se actualizo la orden', result);
      } else if (result['state'] === 'Fail') {
        console.log('No se pudo actualizar la orden', result);
      }
    });
    this.cerrarModal.emit();
    this.cerrarActualizar.emit();
  }

  addWeight(): void {
    if (this.selectedQuality === 'first') {
        if (this.newWeight !== undefined && this.newWeight > 0) {
            this.firstQualityWeights.push(this.newWeight);
            this.newWeight = undefined;
        }
    } else if (this.selectedQuality === 'second') {
        if (this.newWeight !== undefined && this.newWeight > 0) {
          this.secondQualityWeights.push(this.newWeight);
          this.newWeight = undefined;
        }
    }
  }
  
  mostrarTodos: boolean = false;
  qualityFilter: boolean =false;
  
  toggleVerTodos() {
    this.mostrarTodos = !this.mostrarTodos;
  }

  filter() {
    this.qualityFilter = !this.qualityFilter;
  }

  deleteWeight(index: number): void {
    if (this.selectedQuality === 'first') {
      this.firstQualityWeights.splice(index, 1);
    } else if (this.selectedQuality === 'second') {
      this.secondQualityWeights.splice(index, 1);
    }
  }

  calculateTotalBunches(weights: number[]): number {
    return weights.length;
  }
  
  calculateTotalWeight(weights: number[]): number {
    return weights.reduce((acc, weight) => acc + weight, 0);
  }
  
  calculateTotalPrice(weights: number[], pricePerKilo?: number): string {
    if (pricePerKilo !== undefined) {
      const totalPrice = this.calculateTotalWeight(weights) * pricePerKilo;
      return totalPrice.toLocaleString('es-ES');
    }
    return '0';
  }
  
  // Calcula el total de racimos sumando la longitud de los arreglos de pesos de ambas calidades
  calculateTotalBunchesAll(): number {
    return this.firstQualityWeights.length + this.secondQualityWeights.length;
  }

  // Calcula el total del peso sumando los pesos de ambas calidades
  calculateTotalWeightAll(): number {
    return this.calculateTotalWeight(this.firstQualityWeights) + this.calculateTotalWeight(this.secondQualityWeights);
  }

  // Calcula el precio total sumando los precios de ambas calidades
  calculateTotalPriceAll(): string {
    const totalPriceAll =
      parseFloat(this.calculateTotalPrice(this.firstQualityWeights, this.firstQualityPricePerKilo)) +
      parseFloat(this.calculateTotalPrice(this.secondQualityWeights, this.secondQualityPricePerKilo));
    return totalPriceAll.toLocaleString('es-ES');
  }  

  finish(){
    // const sumaPlatanosString = this.sumaPlatanos !== undefined ? this.sumaPlatanos.toString() : undefined;
    // const sumaPlatanosCalidadString = this.sumaPlatanosCalidad !== undefined ? this.sumaPlatanosCalidad.toString() : undefined;
    // const platanosLengthString = this.platanos.length.toString();
    // const platanosCalidadLengthString = this.platanosCalidad.length.toString();
    // const precioTotal = this.precioPlatano !== undefined && this.precioPlatanoCalidad !== undefined ? (this.precioPlatano + this.precioPlatanoCalidad).toString() : undefined;
    // console.log(this.orderID,' ', sumaPlatanosString,' ', sumaPlatanosCalidadString,' ', platanosLengthString,' ', platanosCalidadLengthString,' ', precioTotal)
    // // this.service.updateOrder(this.orderID, sumaPlatanosString, sumaPlatanosCalidadString, platanosLengthString, platanosCalidadLengthString, precioTotal, undefined, undefined, '4').subscribe(result => {
    //   if (result['state'] === 'Ok') {
    //     console.log('Se actualizo la orden',result);
    //   } else if (result['state'] === 'Fail') {
    //     console.log('No se pudo actualizar la orden',result);
    //   }
    // });
    this.viewConfirmationModal = true;
  }

  onCancel() {
    this.viewConfirmationModal = false;
  }

  onConfirm() {
    this.viewConfirmationModal = false;
  }
}
