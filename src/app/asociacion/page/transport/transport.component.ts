import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';

interface VehicleType {
  id: number;
  name: string;
}

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.css']
})
export class TransportComponent {
  stateValue:string = "all";
  stateFlag:boolean = false;
  buttonFlag:boolean = false;
  searchFlag:boolean = false;
  docNumberInput?:number;
  Transporters: any[] = [];

  typeSelect: { [key: number]: string } = {
    0: 'Sencillo',
    1: 'Camioneta estacas',
    2: 'Camioneta platón',
    3: 'Turbo',
    4: 'Furgoneta',
    5: 'Dobletroque',
    6: 'Minimula',
    7: 'Tractomula',
  };

  infoUser = this.formBuilder.group({
    state: ['all'] // Default value, you can set it to 'activo', 'inactivo', or 'todos'
  });

  constructor(private formBuilder: FormBuilder, private service: AsociacionService, private router: Router) {
    this.infoUser.valueChanges.subscribe(() => {
      this.stateValue = this.infoUser.value.state ?? 'all';
      console.log(this.stateValue);
      this.View();
    });
  }

  ngOnInit(): void{
    this.View();
  }

  View() {
    this.docNumberInput = undefined;
    this.buttonFlag = false;
    this.searchFlag = false;
    this.service.getTransporters(this.stateValue).subscribe(Transporters => {
      if (Transporters['state'] === 'Fail') {
        this.stateFlag = true;
        console.log("No hay usuarios para mostrar");
        this.Transporters = [];
      } else {
        this.Transporters = Transporters.data;
        this.stateFlag = false;
        console.log(Transporters.data);
      }  
    });
  }

  docSearch() {
    console.log(this.docNumberInput);
  
    // Verifica si el número de documento es un valor numérico antes de realizar la búsqueda
    if (this.docNumberInput !== undefined && this.docNumberInput !== null && !isNaN(this.docNumberInput)) {
      const resultFind = this.Transporters.filter(person => person.docNumber === this.docNumberInput!.toString());
      this.Transporters = [];
      this.buttonFlag = true;
      if (resultFind.length > 0) {
        console.log('Persona encontrada:', resultFind);
        // Puedes almacenar el objeto encontrado en otra variable si es necesario
        // this.personFound = resultFind;
        this.Transporters = resultFind;
        this.searchFlag = false;
      } else {
        this.searchFlag = true;
        console.log('Persona no encontrada');
      }
    } else {
      console.log('Número de documento no válido');
    }
  }
  // Modal -----------------------------------------------------------
  modalVisible = false;
  modalData: { numeroDocumento?: number, tipoDocumento?: number, placa?: string} = {};

  mostrarModal(numeroDocumento?: number, tipoDocumento?: number, placa?: string) {
    this.modalData = { numeroDocumento, tipoDocumento, placa };
    // console.log(this.modalData.numeroDocumento, this.modalData.tipoDocumento);
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  //Modal para crear vehículo
  createVehicleVisible = false;

  mostrarcreateVehicle() {
    // console.log(this.modalData.numeroDocumento, this.modalData.tipoDocumento);
    this.createVehicleVisible = true;
  }

  cerrarcreateVehicleVisible() {
    this.createVehicleVisible = false;
  }
}
