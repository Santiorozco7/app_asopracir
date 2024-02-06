import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  farmerRegister:boolean = false;
  assocRegister:boolean = false;
  transporterRegister:boolean = false;
  collaboratorRegister:boolean = false;
  searchFlag:boolean = false;
  searchValidator:boolean = false;

  docTypeaux:string = '';
  docNumberaux:string = '';
  userID:string = '';
  
  // Roles del usuario
  userFarmer:boolean = false;
  userTransporter:boolean = false;
  userCollaborator:boolean = false;
  userAssoc:boolean = false;

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
    this.userForm.valueChanges.subscribe(() => {
      if (this.infoUser.value.docNumber !== this.userForm.value.docNumber ||
        this.infoUser.value.docType !== this.userForm.value.docType) {
          this.farmerRegister = false;
          this.transporterRegister = false;
          this.collaboratorRegister = false;
          this.searchFlag = false;
        console.log("Hubo cambios en el formulario");
      }
    });
    this.infoUser.valueChanges.subscribe(() => {
      if (this.infoUser.value.docNumber !== this.docNumberaux ||
        this.infoUser.value.docType !== this.docTypeaux) {
          this.farmerRegister = false;
          this.transporterRegister = false;
          this.collaboratorRegister = false;
          this.searchValidator = false;
        console.log("Hubo cambios en el formulario");
      }
    });
    
  }

  infoUser = this.formBuilder.group({
    docType: [''],
    docNumber: ['']
  });

  userForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    firstLastname: ['', [Validators.required]],
    docType: ['', [Validators.required]],
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

    //Colaborador
    roleNameCollab: [''],

    //Asociado
    roleNameAssoc: [''],
  });

  roleAddForm = this.formBuilder.group({
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

    //Colaborador
    roleNameCollab: [''],

    //Asociado
    roleNameAssoc: [''],
  });

  View() {
    console.log("Recargando..........");
    if (this.farmerRegister) {
      console.log("Recargando fincas");
      this.router.navigate(['/asociacion/fincas']);
    }
    if (this.transporterRegister) {
      console.log("Recargando transportadores");
      this.router.navigate(['/asociacion/transporte']);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
  
      // Recopila los datos del formulario
      const names: string = formData.name || "";
      const firstLastname: string = formData.firstLastname || "";
      const docType: string = formData.docType || "";
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
      const bankAccountType: string = formData.bankAccountType || "";
      const bankAccountNumber: string = formData.bankAccountNumber || "";

      //Datos de la fica
      const GPSposition: string = formData.GPSposition ?? "";
      const area: string = formData.area ?? "";
      const cityFarm: string = formData.cityFarm ?? "";
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

      //Datos colaborador
      const roleNameCollab: string = formData.roleNameCollab ?? "";

      //Datos asociado
      const roleNameAssoc: string = formData.roleNameAssoc ?? "";

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

          if (this.farmerRegister) {  //Crear Agricultor
            console.log("Creando agricultor.....................");
            console.log(farmName,' ',zoneName,' ',cityFarm,' ',area,' ',GPSposition);
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
                    console.log('Agricultor no fue creado',resultFarm);
                  }
                })
              } if(resultFarm['state'] === 'Fail') {
                console.log('Finca no fue creado');
              }
            })
          }
          if (this.transporterRegister) {  //Crear Transportador
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
          if (this.collaboratorRegister) {  //Crear Colaborador
            console.log("Creando colaborador...................");
            this.service.createCollab(resultUser.data.userID, roleNameCollab).subscribe(resultCollab => {
              if (resultCollab['state'] === 'Ok') {
                console.log("Colaborador Creado");
                this.View();
              }if (resultCollab['state'] === 'Fail') {
                console.log("Colaborador no creado");
              }
            });
          }
          if (this.assocRegister) {  //Crear Asociado
            console.log("Creando colaborador...................");
            this.service.createCollab(resultUser.data.userID, roleNameAssoc).subscribe(resultAssoc => {
              if (resultAssoc['state'] === 'Ok') {
                console.log("Asociado Creado");
                this.View();
              }if (resultAssoc['state'] === 'Fail') {
                console.log("Asociado no creado");
              }
            });
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
    switch (selectedValue) {
      case '0':
        this.farmerRegister = true;
        this.assocRegister = false;
        this.collaboratorRegister = false;
        this.transporterRegister = false;
        console.log('Registrar un Agricultor');
        break;
      
      case '1':
        this.farmerRegister = false;
        this.assocRegister = true;
        this.collaboratorRegister = false;
        this.transporterRegister = false;
        console.log('Registrar un Asociado');
        break;

      case '2':
        this.farmerRegister = false;
        this.assocRegister = false;
        this.collaboratorRegister = true;
        this.transporterRegister = false;
        console.log('Registrar un Colaborador');
        break;

      case '3':
        this.farmerRegister = false;
        this.assocRegister = false;
        this.collaboratorRegister = false;
        this.transporterRegister = true;
        console.log('Registrar un Transportador');
        break;

      default:
        this.farmerRegister = false;
        this.transporterRegister = false;
        this.collaboratorRegister = false;
        this.assocRegister = false;
        console.log('Aun no hay seleccion');
        break;
    }
  }

  onSubmitUser(): void {
    if (this.infoUser.valid) {
      const formDataUser = this.infoUser.value;
      this.docTypeaux = formDataUser.docType ?? "";
      this.docNumberaux = formDataUser.docNumber ?? "";

      // console.log(formDataUser);

      this.service.getUser(this.docTypeaux, this.docNumberaux).subscribe(userData => {
        if (userData['state'] === 'Ok') {
          this.userID = userData.data.userID;
          this.farmerRegister = false;
          this.transporterRegister = false;
          this.collaboratorRegister = false;
          this.searchFlag = false;
          this.searchValidator = true;
          console.log(userData.data);
          this.service.getRoles(this.docTypeaux, this.docNumberaux).subscribe(userRoles => {
            if (userRoles['state'] === 'Ok') {
              console.log("Roles encontrados: ", userRoles.data);
              this.userFarmer = userRoles.data.isFarmer;
              this.userAssoc = userRoles.data.isAdmin;
              this.userTransporter = userRoles.data.isTransporter;
              this.userCollaborator = userRoles.data.isCollab;
              console.log(this.userFarmer);
            }else if (userRoles['state'] === 'Fail') {
              console.log("Roles no encontrados: ", userRoles.data);
            }
          });
        }else if(userData['state'] === 'Fail') {
          this.farmerRegister = true;
          this.transporterRegister = false;
          this.collaboratorRegister = false;
          this.searchFlag = true;
          this.searchValidator = false;
          this.userForm.patchValue({
            docType: this.docTypeaux,
            docNumber: this.docNumberaux
          });
          console.log('No hay Usuario registrado con esa CC',userData.data);
        }
      });      
    }
  }

  rolesAdd(selectRole:string):void {
    switch (selectRole) {
      case '0':
        this.farmerRegister = true;
        this.assocRegister = false;
        this.collaboratorRegister = false;
        this.transporterRegister = false;
        console.log('Registrar un Agricultor');
        break;
      
      case '1':
        this.farmerRegister = false;
        this.assocRegister = true;
        this.collaboratorRegister = false;
        this.transporterRegister = false;
        console.log('Registrar un Asociado');
        break;

      case '2':
        this.farmerRegister = false;
        this.assocRegister = false;
        this.collaboratorRegister = true;
        this.transporterRegister = false;
        console.log('Registrar un Colaborador');
        break;

      case '3':
        this.farmerRegister = false;
        this.assocRegister = false;
        this.collaboratorRegister = false;
        this.transporterRegister = true;
        console.log('Registrar un Transportador');
        break;

      default:
        this.farmerRegister = false;
        this.transporterRegister = false;
        this.collaboratorRegister = false;
        this.assocRegister = false;
        console.log('Aun no hay seleccion');
        break;
    }
  }

  submitRole():void {
    console.log("entro")
    if (this.roleAddForm.valid) {
      const formData = this.roleAddForm.value;

      //Datos de la fica
      const GPSposition: string = formData.GPSposition ?? "";
      const area: string = formData.area ?? "";
      const cityFarm: string = formData.cityFarm ?? "";
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

      //Datos colaborador
      const roleNameCollab: string = formData.roleNameCollab ?? "";

      //Datos asociado
      const roleNameAssoc: string = formData.roleNameAssoc ?? "";

      if (this.farmerRegister) {  //Crear Agricultor
        console.log("Creando agricultor.....................");
        console.log(farmName,' ',zoneName,' ',cityFarm,' ',area,' ',GPSposition);
        this.service.createFarm(
          farmName,
          zoneName,
          cityFarm,
          area,
          GPSposition
        ).subscribe(resultFarm=>{
          if (resultFarm['state'] === 'Ok') {
            console.log('Finca creada con id:', resultFarm.data.farmID);
            this.service.createFarmer(this.userID, resultFarm.data.farmID).subscribe(resultFarmer => {
              if (resultFarmer['state'] === 'Ok') {
                console.log('Agricultor fue creado');
                this.View(); 
              } if(resultFarmer['state'] === 'Fail') {
                console.log('Agricultor no fue creado',resultFarm);
              }
            })
          } if(resultFarm['state'] === 'Fail') {
            console.log('Finca no fue creado');
          }
        })
      }
      if (this.transporterRegister) {  //Crear Transportador
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
            this.service.createTransporter(this.userID, resultVehicle.data.vehID, licenseType, licenseExpiration).subscribe(resultTransport => {
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
      if (this.collaboratorRegister) {  //Crear Colaborador
        console.log("Creando colaborador...................");
        this.service.createCollab(this.userID, roleNameCollab).subscribe(resultCollab => {
          if (resultCollab['state'] === 'Ok') {
            console.log("Colaborador Creado");
            this.View();
          }if (resultCollab['state'] === 'Fail') {
            console.log("Colaborador no creado");
          }
        });
      }
      if (this.assocRegister) {  //Crear Asociado
        console.log("Creando colaborador...................");
        this.service.createCollab(this.userID, roleNameAssoc).subscribe(resultAssoc => {
          if (resultAssoc['state'] === 'Ok') {
            console.log("Asociado Creado");
            this.View();
          }if (resultAssoc['state'] === 'Fail') {
            console.log("Asociado no creado");
          }
        });
      }
    }else{
      console.log("Pero no hizo nada")
    }
  }
}
