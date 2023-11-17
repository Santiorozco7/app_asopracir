import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  selectRegister = true;

  docTypeselect: any[] = [
    { id: 0, name: 'CC' },
    { id: 1, name: 'TI' },
    { id: 2, name: 'CE' },
    { id: 3, name: 'NIT' },
  ];

  bankAccountTypeselect: any[] = [
    { id: 0, name: 'Cuenta de ahorros' },
    { id: 1, name: 'Corriente' },
  ];

  typeSelect: any[] = [
    { id: 0, name: 'Sencillo' },
    { id: 1, name: 'Camioneta estacas' },
    { id: 2, name: 'Camioneta platón' },
    { id: 3, name: 'Turbo' },
    { id: 4, name: 'Furgoneta' },
    { id: 5, name: 'Dobletroque' },
    { id: 6, name: 'Minimula' },
    { id: 7, name: 'Tractomula' },
  ];

  stateSelect: any[] = [
    { id: 0, name: 'Operacional' },
    { id: 1, name: 'Mantenimiento' },
    { id: 2, name: 'Fuera de servicio' },
  ];

  constructor(private formBuilder: FormBuilder, private service: AsociacionService, private router: Router) {
    
  }

  loteForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    firstLastname: ['', [Validators.required]],
    docType: [, [Validators.required]],
    docNumber: ['', [Validators.required]],
    secondLastname: [''],  // este sea opcional
    docIssueDate: [''],
    docIssuePlace: [''],
    birthday: [''],
    address: [''],
    city: [''],
    phoneNumber: [''],
    altPhoneNumber: [''],
    email: [''],
    bankAccountBName: [''],
    bankAccountType: [],
    bankAccountNumber: [''],

    //Agricultor
    GPSposition: [''],
    area: [],
    cityFarm: [''],
    farmName: [''],
    fileOwnerCertificate: [''],
    zoneName: [''],

    //Transportador
    licenseExpiration: [''],
    licenseType: [''],
    comments: [''],

    plate: [''],
    soatExpiration: [''],
    techExpiration: [''],
    type: [''],
    state: [''],
    capacity: [''],
  });

  View() {
    console.log("Recargando..........");
    if (this.selectRegister) {
      console.log("Recargando fincas");
      this.router.navigate(['/asociacion/fincas']);
    }
    if (!this.selectRegister) {
      console.log("Recargando transportadores");
      this.router.navigate(['/asociacion/transporte']);
    }
    
  }

  onSubmit(): void {
    if (this.loteForm.valid) {
      const formData = this.loteForm.value;
  
      // Recopila los datos del formulario
      const names: string = formData.name || "";
      const firstLastname: string = formData.firstLastname || "";
      const docType: any = formData.docType;
      const docNumber: string = formData.docNumber || "";
  
      // Recopila los campos opcionales
      const secondLastname: string = formData.secondLastname || "";
      const docIssueDate: string = formData.docIssueDate || "";
      const docIssuePlace: string = formData.docIssuePlace || "";
      const birthday: string = formData.birthday || "";
      const address: string = formData.address || "";
      const city: string = formData.city || "";
      const phoneNumber: string = formData.phoneNumber || "";
      const altPhoneNumber: string = formData.altPhoneNumber || "";
      const email: string = formData.email || "";
      const bankAccountBName: string = formData.bankAccountBName || "";
      const bankAccountType: any = formData.bankAccountType;
      const bankAccountNumber: string = formData.bankAccountNumber || "";

      //Datos de la fica
      const GPSposition: string = formData.GPSposition ?? "";
      const area: string = formData.area ?? "";
      const cityFarm: string = formData.city ?? "";
      const farmName: string = formData.farmName ?? "";
      const fileOwnerCertificate: string = formData.fileOwnerCertificate ?? "";
      const zoneName: string = formData.zoneName ?? "";

      //Datos transportador
      const licenseExpiration: string = formData.licenseExpiration ?? "";
      const licenseType: string = formData.licenseType ?? "";
      const plate: string = formData.plate ?? "";
      const soatExpiration: string = formData.soatExpiration ?? "";
      const techExpiration: string = formData.techExpiration ?? "";
      const type: string = formData.type ?? "";
      const state: string = formData.state ?? "";
      const capacity: string = formData.capacity ?? "";
      const comments: string = formData.comments ?? "";

      this.service.createUser(
        names,
        firstLastname,
        docType,
        docNumber,
        secondLastname,
        docIssueDate,
        docIssuePlace,
        birthday,
        address,
        city,
        phoneNumber,
        altPhoneNumber,
        email,
        bankAccountBName,
        bankAccountType,
        bankAccountNumber
      ).subscribe(resultUser => {
        if (resultUser['state'] === 'Ok') {
          console.log('Usuario creado con id:', resultUser.data.userID);
          if (this.selectRegister) {  //Crear Agricultor
            console.log("Creando agricultor.....................");
            this.service.createFarm(
              farmName,
              zoneName,
              cityFarm,
              area,
              GPSposition
            ).subscribe(resultFarm=>{
              if (resultFarm['state'] === 'Ok') {
                console.log('Finca creada con id:', resultFarm.data.farmID);
                this.service.createFarmer(resultUser.data.userID, resultFarm.data.farmID).subscribe(resultFarmer => {
                  if (resultFarmer['state'] === 'Ok') {
                    console.log('Agricultor fue creado');
                    this.View(); 
                  } if(resultFarmer['state'] === 'Fail') {
                    console.log('Agricultor no fue creado');
                  }
                })
              } if(resultFarm['state'] === 'Fail') {
                console.log('Finca no fue creado');
              }
            })
          }
          if (!this.selectRegister) {  //Crear Transportador
            console.log("Creando trasnportador...................");
            this.service.createVehicle(
              plate,
              soatExpiration,
              techExpiration,
              type,
              capacity,
              comments,
            ).subscribe(resultVehicle => {
              if (resultVehicle['state'] === 'Ok') {
                console.log('Vehículo creada con id:', resultVehicle.data.vehID);
                this.service.createTransporter(resultUser.data.userID, resultVehicle.data.vehID, licenseType, licenseExpiration).subscribe(resultTransport => {
                  if (resultTransport['state'] === 'Ok') {
                    console.log("Transportador Creado");
                    this.View();
                  }if (resultVehicle['state'] === 'Fail') {
                    console.log("Trasnportador no creado");
                  }
                })
              }if (resultVehicle['state'] === 'Fail') {
                console.log("Vehiculo no creado");
              }
            })
          }
        }if(resultUser['state'] === 'Fail') {
          console.log('Usuario no fue creado');
        }
      });
    }
  }

  onSelectUserType(event: any) {
    const selectedValue = event.target.value; // Obtiene el valor seleccionado
    console.log('Valor seleccionado:', selectedValue);
    this.selectRegister = !this.selectRegister;
  }
}
