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
  selectedValue: string = '0';

  showDialog = false;
  positiveNotification = true;
  message = '';

  docTypeselect: any[] = [
    { id: 0, name: 'Cédula de ciudadanía' },
    { id: 1, name: 'Cédula de extranjería' },
    { id: 2, name: 'NIT' },
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

  closeNotification(): void {
    this.showDialog = false;
  }

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
                    this.showDialog = true;
                    this.positiveNotification = true;
                    this.message = `Se ha registrado un nuevo usuario con éxito`;
                    setTimeout(() => {
                      this.View();
                    }, 3200);
                  } if(resultFarmer['state'] === 'Fail') {
                    console.log('Agricultor no fue creado',resultFarm);
                    this.showDialog = true;
                    this.positiveNotification = false;
                    this.message = '¡Ha ocurrido un error!';
                  }                  
                })
              } if(resultFarm['state'] === 'Fail') {
                console.log('Finca no fue creado');
                this.showDialog = true;
                this.positiveNotification = false;
                this.message = '¡Ha ocurrido un error!';
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
                    this.showDialog = true;
                    this.positiveNotification = true;
                    this.message = `Se ha registrado un nuevo usuario con éxito`;
                    setTimeout(() => {
                      this.View();
                    }, 3200);
                  }if (resultVehicle['state'] === 'Fail') {
                    console.log("Trasnportador no creado");
                    this.showDialog = true;
                    this.positiveNotification = false;
                    this.message = '¡Ha ocurrido un error!';
                  }
                })
              }if (resultVehicle['state'] === 'Fail') {
                console.log("Vehiculo no creado");
                this.showDialog = true;
                this.positiveNotification = false;
                this.message = '¡Ha ocurrido un error!';
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
          this.showDialog = true;
          this.positiveNotification = false;
          this.message = '¡Ha ocurrido un error!';
        }
      });
    }
  }

  onSelectUserType(event: any) {
    this.selectedValue = event.target.value; // Obtiene el valor seleccionado
    console.log('Valor seleccionado:', this.selectedValue);
    switch (this.selectedValue) {
      case '0':
        this.farmerRegister = true;
        this.assocRegister = false;
        this.collaboratorRegister = false;
        this.transporterRegister = false;
        console.log('Registrar un Agricultorr');
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

  getHeaderIcon(): { path: string, viewBox: string } {
    const path = this.selectedValue === '0'
      ? "M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
      : (this.selectedValue === '1'
        ? "M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h50.7L544 237.3V256H416V160zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
        : "M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h50.7L544 237.3V256H416V160zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z");
  
    const viewBox = this.selectedValue === '0' 
      ? '0 0 576 512' 
      : (this.selectedValue === '0'
        ? '0 0 640 512'
        : '0 0 640 512');
    return { path, viewBox };
  }
  
  getHeader(): string {
    return this.selectedValue === '0' ? 'Información de la finca' : (this.selectedValue === '1' ? 'Información del transportador' : 'Información del colaborador');
  }

  cerrarTodo() {
    this.searchFlag = false;
    this.searchValidator = false;
  }

  areAgricultorFieldsValid(): boolean {
    const agricultorFields = ['farmName', 'zoneName', 'cityFarm', 'area'];
    return agricultorFields.every(field => this.userForm.get(field)?.value !== null && this.userForm.get(field)?.value !== '');
  }
  
  areTransporterFieldsValid(): boolean {
    const transporterFields = ['licenseType', 'licenseExpiration', 'plate', 'soatExpiration', 'techExpiration', 'type', 'state', 'capacity'];
    return transporterFields.every(field => this.userForm.get(field)?.value !== null && this.userForm.get(field)?.value !== '');
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
