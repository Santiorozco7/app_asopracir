import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

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
  originalTransporters: any[] = []; // Copia de respaldo de los datos originales
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

  constructor(private formBuilder: FormBuilder, private service: AsociacionService, private router: Router, private authService: AuthService) {
    this.infoUser.valueChanges.subscribe(() => {
      this.stateValue = this.infoUser.value.state ?? 'all';
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
      if (Transporters['state'] === 'Ok'){
        this.originalTransporters = Transporters.data; 
        this.Transporters = Transporters.data;
        this.stateFlag = false;
      } else if ((Transporters['state'] === 'Fail') && (Transporters['sessionStatus'] !== 'Session expired')) {
        this.stateFlag = true;
        this.Transporters = [];
        this.originalTransporters = [];
      } else if ((Transporters['state'] === 'Fail') && (Transporters['sessionStatus'] === 'Session expired')) {
        this.authService.logout();
        this.router.navigate(['/']);
      }
    });
  }

  docSearch() {
  
    // Verifica si el número de documento es un valor numérico antes de realizar la búsqueda
   if (this.docNumberInput) {
      const resultFind = this.originalTransporters.filter(person => person.docNumber.toString() === this.docNumberInput!.toString());

      if (resultFind.length > 0) {
        this.Transporters = resultFind;
        this.searchFlag = false;
      } else {
        this.searchFlag = true;
        this.Transporters = []; // Limpiar los resultados actuales si no se encuentra ninguna coincidencia
      }
    } else {
      this.Transporters = this.originalTransporters;
      this.searchFlag = false;
    }
  }
  // Modal -----------------------------------------------------------
  modalVisible = false;
  modalData: { numeroDocumento?: number, tipoDocumento?: number, placa?: string} = {};

  mostrarModal(numeroDocumento?: number, tipoDocumento?: number, placa?: string) {
    this.modalData = { numeroDocumento, tipoDocumento, placa };
  
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  //Modal para crear vehículo
  createVehicleVisible = false;

  mostrarcreateVehicle() {
  
    this.createVehicleVisible = true;
  }

  cerrarcreateVehicleVisible() {
    this.createVehicleVisible = false;
  }
}
