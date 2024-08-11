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
      } else if ((farms['state'] === 'Fail') && (farms['sessionStatus'] !== 'Session expired')) {
        this.stateFlag = true;
        this.farms = [];
        this.originalFarms = [];
      } else if ((farms['state'] === 'Fail') && (farms['sessionStatus'] === 'Session expired')) {
        this.authService.logout();
        this.router.navigate(['/']);
      }
    });
  }
  docSearch() {
    if (this.docNumberInput) {
      const resultFind = this.originalFarms.filter(person => person.docNumber.toString() === this.docNumberInput!.toString());
      if (resultFind.length > 0) {
        this.farms = resultFind;
        this.searchFlag = false;
      } else {
        this.searchFlag = true;
        this.farms = []; // Limpiar los resultados actuales si no se encuentra ninguna coincidencia
      }
    } else {
      this.farms = this.originalFarms;
      this.searchFlag = false;
    }
  }
  modalVisible = false;
  modalData: { numeroDocumento?: string, tipoDocumento?: string } = {};
  mostrarModal(numeroDocumento?: string, tipoDocumento?: string) {
    this.modalData = { numeroDocumento, tipoDocumento };
    this.modalVisible = true;
  }
  cerrarModal() {
    this.modalVisible = false;
  }
}
