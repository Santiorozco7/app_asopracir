import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-farms',
  templateUrl: './farms.component.html',
  styleUrls: ['./farms.component.css']
})
export class FarmsComponent {
  stateValue:string = "all";
  stateFlag:boolean = false;
  buttonFlag:boolean = false;
  searchFlag:boolean = false;
  docNumberInput?:number;
  originalFarms: any[] = []; 
  farms: any[] = [];

  infoUser = this.formBuilder.group({
    state: ['all'] 
  });

  constructor(private formBuilder: FormBuilder, private service: AsociacionService, private router: Router, private authService: AuthService) {
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
    this.service.getFarms(this.stateValue, undefined, undefined).subscribe(farms => {
      if (farms['state'] === 'Ok'){
        this.originalFarms = farms.data; 
        this.farms = farms.data;
        this.stateFlag = false;
        console.log(farms.data);
      } else if ((farms['state'] === 'Fail') && (farms['sessionStatus'] !== 'Session expired')) {
        this.stateFlag = true;
        console.log("No hay usuarios para mostrar", farms);
        this.farms = [];
        this.originalFarms = [];
      } else if ((farms['state'] === 'Fail') && (farms['sessionStatus'] === 'Session expired')) {
        this.authService.logout();
        this.router.navigate(['/']);
        console.log('No hay session',farms);
      }
    });
  }

  docSearch() {
    console.log(this.docNumberInput);
  
    if (this.docNumberInput) {
      const resultFind = this.originalFarms.filter(person => person.docNumber.toString() === this.docNumberInput!.toString());
  
      if (resultFind.length > 0) {
        console.log('Persona encontrada:', resultFind);
        this.farms = resultFind;
        this.searchFlag = false;
      } else {
        this.searchFlag = true;
        console.log('Persona no encontrada');
        this.farms = []; // Limpiar los resultados actuales si no se encuentra ninguna coincidencia
      }
    } else {
      console.log('Número de documento no válido');
      this.farms = this.originalFarms;
      this.searchFlag = false;
    }
  }
  
  

  // Modal -----------------------------------------------------------
  modalVisible = false;
  modalData: { numeroDocumento?: string, tipoDocumento?: string } = {};

  mostrarModal(numeroDocumento?: string, tipoDocumento?: string) {
    this.modalData = { numeroDocumento, tipoDocumento };
    // console.log(this.modalData.numeroDocumento, this.modalData.tipoDocumento);
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }
}
