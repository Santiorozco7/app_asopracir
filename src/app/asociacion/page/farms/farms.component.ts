import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';

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
  farms: any[] = [];

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
    this.service.getFarms(this.stateValue, undefined, undefined).subscribe(farms => {
      if (farms['state'] === 'Fail') {
        this.stateFlag = true;
        console.log("No hay usuarios para mostrar");
        this.farms = [];
      }
      if (farms['state'] === 'Ok'){
        this.farms = farms.data;
        this.stateFlag = false;
        console.log(farms.data);
      }
    });
  }

  docSearch() {
    console.log(this.docNumberInput);
  
    // Verifica si el número de documento es un valor numérico antes de realizar la búsqueda
    if (this.docNumberInput !== undefined && this.docNumberInput !== null && !isNaN(this.docNumberInput)) {
      const resultFind = this.farms.find(person => person.docNumber === this.docNumberInput!.toString());
      this.farms = [];
      this.buttonFlag = true;
      if (resultFind) {
        console.log('Persona encontrada:', resultFind);
        // Puedes almacenar el objeto encontrado en otra variable si es necesario
        // this.personFound = resultFind;
        this.farms = [resultFind];
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
