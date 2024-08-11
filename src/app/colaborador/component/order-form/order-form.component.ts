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
    if (this.stateFlag) {
      this.service.updateOrder(orderIDString, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '2').subscribe(result => {
        if (result['state'] === 'Ok') {
        } else if (result['state'] === 'Fail') {
        }
      });
    }
  }
  
  firstQualityWeights: number[] = [];
  firstQualityPricePerKilo?: number;
  secondQualityWeights: number[] = [];
  secondQualityPricePerKilo?: number;
  thirdQualityWeights: number[] = [];
  thirdQualityPricePerKilo?: number;

  newWeight?: number;
  selectedQuality: string = 'first'; 

  encargado: string = "";
  viewConfirmationModal: boolean = false;

  
  showDialog = false;
  positiveNotification = true;
  message = '';

  constructor(private service: ColaboradorService) {}

  View(){
    this.service.getPrice().subscribe(price => {
      if (price['state'] === 'Ok') {
        this.firstQualityPricePerKilo = price.data.price1;
        this.secondQualityPricePerKilo = price.data.price2;
        this.thirdQualityPricePerKilo = price.data.price3;
      } else if (price['state'] === 'Fail') {
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Verificar si hay un cambio en la variable orderID
    if (changes['orderID'] && !changes['orderID'].firstChange) {
      this.orderIDtemp = this.orderID;

      this.firstQualityWeights = [];
      this.firstQualityPricePerKilo = undefined;
      this.secondQualityWeights = [];
      this.secondQualityPricePerKilo = undefined;
      this.thirdQualityWeights = [];
      this.thirdQualityPricePerKilo = undefined;
      
      this.newWeight = undefined;

      this.encargado = "";
      this.stateFlag = true;
    }
  }

  cerrar() {
    const orderID = this.orderID !== "" ? this.orderID : undefined;
    const orderIDString = orderID !== undefined ? orderID : "";
    this.service.updateOrder(orderIDString, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '2').subscribe(result => {
      if (result['state'] === 'Ok') {
      } else if (result['state'] === 'Fail') {
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
    } else if (this.selectedQuality === 'third') {
        if (this.newWeight !== undefined && this.newWeight > 0) {
          this.thirdQualityWeights.push(this.newWeight);
          this.newWeight = undefined;
        }
    }
  }
  
  mostrarTodos: boolean = false;
  qualityFilter: number = 0;
  
  toggleVerTodos() {
    this.mostrarTodos = !this.mostrarTodos;
  }

  filter() {
    this.qualityFilter = this.qualityFilter + 1;
    if (this.qualityFilter == 3) {
      this.qualityFilter = 0;
    }
  }

  deleteWeight(index: number): void {
    if (this.qualityFilter == 0) {
      this.firstQualityWeights.splice(index, 1);
      this.showDialog = true;
      this.positiveNotification = true;
      this.message = `Se ha eliminado el racimo de primera`;              
    } else if (this.qualityFilter == 1) {
      this.secondQualityWeights.splice(index, 1);
      this.showDialog = true;
      this.positiveNotification = true;
      this.message = `Se ha eliminado el racimo de segunda`;
    } else if (this.qualityFilter == 2) {
      this.thirdQualityWeights.splice(index, 1);
      this.showDialog = true;
      this.positiveNotification = true;
      this.message = `Se ha eliminado el racimo de tercera`;
    }
  }

  calculateTotalBunches(weights: number[]): number {
    return weights.length;
  }
  
  calculateTotalWeight(weights: number[]): number {
    return weights.reduce((acc, weight) => acc + weight, 0);
  }
  
  calculateTotalPrice(weights: number[], pricePerKilo?: number): number {
    if (pricePerKilo !== undefined) {
      const totalPrice = this.calculateTotalWeight(weights) * pricePerKilo;
      return totalPrice;
    }
    return 0;
  }
  
  // Calcula el total de racimos sumando la longitud de los arreglos de pesos de ambas calidades
  calculateTotalBunchesAll(): number {
    return this.firstQualityWeights.length + this.secondQualityWeights.length + this.thirdQualityWeights.length;
  }

  // Calcula el total del peso sumando los pesos de ambas calidades
  calculateTotalWeightAll(): number {
    return this.calculateTotalWeight(this.firstQualityWeights) + this.calculateTotalWeight(this.secondQualityWeights) + this.calculateTotalWeight(this.thirdQualityWeights);
  }

  // Calcula el precio total sumando los precios de ambas calidades
  calculateTotalPriceAll(): number {
    const totalPriceAll =
      this.calculateTotalPrice(this.firstQualityWeights, this.firstQualityPricePerKilo) +
      this.calculateTotalPrice(this.secondQualityWeights, this.secondQualityPricePerKilo) +
      this.calculateTotalPrice(this.thirdQualityWeights, this.thirdQualityPricePerKilo);
    return totalPriceAll;
  }  

  finish(){
    this.viewConfirmationModal = true;
  }
    

  onCancel() {
    this.viewConfirmationModal = false;
  }

  onConfirm() {
    const platanosLengthString = this.calculateTotalBunches(this.firstQualityWeights).toString();
    const platanosCalidadLengthString = this.calculateTotalBunches(this.secondQualityWeights).toString();
    const platanosCalidadthirdLengthString = this.calculateTotalBunches(this.thirdQualityWeights).toString();
    const sumaPlatanosString = this.calculateTotalWeight(this.firstQualityWeights) !== undefined ? this.calculateTotalWeight(this.firstQualityWeights).toString() : undefined;
    const sumaPlatanosCalidadString = this.calculateTotalWeight(this.secondQualityWeights) !== undefined ? this.calculateTotalWeight(this.secondQualityWeights).toString() : undefined;
    const sumaPlatanosCalidadSthirdtring = this.calculateTotalWeight(this.thirdQualityWeights) !== undefined ? this.calculateTotalWeight(this.thirdQualityWeights).toString() : undefined;
    const precioTotal = this.firstQualityPricePerKilo !== undefined && this.secondQualityPricePerKilo !== undefined && this.thirdQualityPricePerKilo !== undefined ? this.calculateTotalPriceAll().toString() : undefined;
    
    this.service.updateOrder(this.orderID, sumaPlatanosString, sumaPlatanosCalidadString, sumaPlatanosCalidadSthirdtring, platanosLengthString, platanosCalidadLengthString, platanosCalidadthirdLengthString, precioTotal, undefined, this.encargado, '4').subscribe(result => {
      if (result['state'] === 'Ok') {
        
        this.showDialog = true;
        this.positiveNotification = true;
        this.message = `Se ha cargado con exito la órden`;  
        setTimeout(() => {
          this.stateFlag = false;
          this.viewConfirmationModal = false;
          this.cerrarModal.emit();
          this.cerrarActualizar.emit();
        }, 1500);
      } else if (result['state'] === 'Fail') {
        this.showDialog = true;
        this.positiveNotification = false;
        this.message = `¡Ha ocurrido un error al crear la órden!`;  
      }
    });
    this.viewConfirmationModal = false;
  }

  closeNotification(): void {
    this.showDialog = false;
  }
}
