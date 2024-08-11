import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

interface UploadStatus {
  [key: string]: string;
  user_picture: string;
  user_document: string;
  user_rut: string;
  farm_ownercertificate: string;
  transporter_license: string;
  vehicle_runt: string;
  vehicle_soat: string;
  vehicle_techrev: string;
}

interface Vehicle {
  vehID: string;
  plate: string;
  type: string;
  capacity: string;
  state: string;
  fileRUNT: string;
  fileSOAT: string;
  fileTechRev: string;
  soatExpiration: string;
  techExpiration: string;
  comments: string;
}

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
  userData: any; // Declara una variable para almacenar los datos del usuario
  farmID:string = '';
  vehID:string = '';
  ID:string = '';
  plate:Vehicle[] = [];

  // Variables para verificar la existencia del vehículo por medio de la placa
  activPlate:boolean = false;
  plateValue: string = '';
  
  // Roles del usuario
  userFarmer:boolean = false;
  userTransporter:boolean = false;
  userCollaborator:boolean = false;
  userAssoc:boolean = false;
  selectedValue: string = '0';

  showDialog = false;
  positiveNotification = true;
  message = '';

  photoFilePath: string | null = null; 
  documentFilePath: string | null = null; 
  rutFilePath: string | null = null; 
  licenseFilePath: string | null = null; 
  ownercertificateFilePath: string | null = null; 
  runtFilePath: string | null = null; 
  soatFilePath: string | null = null; 
  techrevFilePath: string | null = null; 
  
  uploadMessage: string = ''; // Variable para almacenar el mensaje de carga

  docTypeselect: any[] = [
    { id: 0, name: 'Cédula de ciudadanía' },
    { id: 1, name: 'Tarjeta de Identidad' },
    { id: 2, name: 'Cédula de Extranjería' },
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

  uploadStatus: UploadStatus = {
    user_picture: '',
    user_document: '',
    user_rut: '',
    farm_ownercertificate: '',
    transporter_license: '',
    vehicle_runt: '',
    vehicle_soat: '',
    vehicle_techrev: ''
  };

  constructor(private formBuilder: FormBuilder, private service: AsociacionService, private router: Router) {
    this.userForm.valueChanges.subscribe(() => {
      if (this.infoUser.value.docNumber !== this.userForm.value.docNumber ||
        this.infoUser.value.docType !== this.userForm.value.docType) {
          this.searchFlag = false;
      }
    });
    this.infoUser.valueChanges.subscribe(() => {
      if (this.infoUser.value.docNumber !== this.docNumberaux ||
        this.infoUser.value.docType !== this.docTypeaux) {
          this.searchValidator = false;
      }
    });
    
  }

  infoUser = this.formBuilder.group({
    docType: [''],
    docNumber: ['']
  });

  userForm = this.formBuilder.group({
    name: [''],
    firstLastname: [''],
    docType: [''],
    docNumber: [''],
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

  closeNotification(): void {
    this.showDialog = false;
  }

  View() {
    if (this.farmerRegister) {
      this.router.navigate(['/asociacion/fincas']);
    }
    if (this.transporterRegister) {
      this.router.navigate(['/asociacion/transporte']);
    }
    else {
      this.router.navigate(['/asociacion/registrar']);
    }
  }

  ngOnInit(): void {        // Verificar la existencia de la placa antes de crear transportador
    this.userForm.get('plate')?.valueChanges
      .pipe(debounceTime(300)) // Espera 300 ms de inactividad antes de actualizar
      .subscribe(value => {
        this.plateValue = (value ?? '').toUpperCase();
        this.service.getVehicle(this.plateValue).subscribe(userData => {
          if (userData['state'] === 'Ok') {
            this.activPlate = true;
          }if(userData['state'] === 'Fail') {
            this.activPlate = false;
          }
        });
      });
  }

  onSubmit(actionType: number): void {
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

      switch(actionType) {
        case 1: 
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
              if (this.farmerRegister) {  //Crear Agricultor
                this.service.createFarm(
                  farmName,
                  zoneName,
                  cityFarm,
                  area,
                  GPSposition
                ).subscribe(resultFarm=>{
                  if (resultFarm['state'] === 'Ok') {
                    this.service.createFarmer(resultUser.data.userID, resultFarm.data.farmID).subscribe(resultFarmer => {
                      if (resultFarmer['state'] === 'Ok') {
                        this.showDialog = true;
                        this.positiveNotification = true;
                        this.message = `Se ha registrado un nuevo usuario con éxito`;
                        setTimeout(() => {
                          this.View();
                        }, 3200);
                      } else if(resultFarmer['state'] === 'Fail') {
                        this.showDialog = true;
                        this.positiveNotification = false;
                        this.message = '¡Ha ocurrido un error!';
                      }                  
                    })
                  } else if(resultFarm['state'] === 'Fail') {
                    this.showDialog = true;
                    this.positiveNotification = false;
                    this.message = '¡Ha ocurrido un error!';
                  }
                })
              }
              if (this.transporterRegister) {  //Crear Transportador
                this.service.createVehicle(
                  plate,
                  soatExpiration,
                  techExpiration,
                  type,
                  capacity,
                  comments,
                ).subscribe(resultVehicle => {
                  if (resultVehicle['state'] === 'Ok') {
                    this.service.createTransporter(resultUser.data.userID, resultVehicle.data.vehID, licenseType, licenseExpiration).subscribe(resultTransport => {
                      if (resultTransport['state'] === 'Ok') {
                        this.showDialog = true;
                        this.positiveNotification = true;
                        this.message = `Se ha registrado un nuevo usuario con éxito`;
                        setTimeout(() => {
                          this.View();
                        }, 3200);
                      } else if (resultVehicle['state'] === 'Fail') {
                        this.showDialog = true;
                        this.positiveNotification = false;
                        this.message = '¡Ha ocurrido un error!';
                      }
                    })
                  } else if (resultVehicle['state'] === 'Fail') {
                    this.showDialog = true;
                    this.positiveNotification = false;
                    this.message = '¡Ha ocurrido un error!';
                  }
                })
              }
              if (this.collaboratorRegister) {  //Crear Colaborador
                this.service.createCollab(resultUser.data.userID, roleNameCollab).subscribe(resultCollab => {
                  if (resultCollab['state'] === 'Ok') {
                    this.View();
                  } else if (resultCollab['state'] === 'Fail') {
                  }
                });
              }
              if (this.assocRegister) {  //Crear Asociado
                this.service.createCollab(resultUser.data.userID, roleNameAssoc).subscribe(resultAssoc => {
                  if (resultAssoc['state'] === 'Ok') {
                    this.View();
                  } else if (resultAssoc['state'] === 'Fail') {
                  }
                });
              }
            } else if ((resultUser['state'] === 'Fail') && (resultUser['sessionStatus'] !== 'Session expired')) {
              this.showDialog = true;
              this.positiveNotification = false;
              this.message = '¡Ha ocurrido un error!';
            } else if ((resultUser['state'] === 'Fail') && (resultUser['sessionStatus'] === 'Session expired')) {
              this.router.navigate(['/']);
            }
          });
          break;
        case 2: 
          if (this.farmerRegister) {  //Crear Agricultor
            this.service.createFarm(
              farmName,
              zoneName,
              cityFarm,
              area,
              GPSposition
            ).subscribe(resultFarm=>{
              if (resultFarm['state'] === 'Ok') {
                this.service.createFarmer(this.userID, resultFarm.data.farmID).subscribe(resultFarmer => {
                  if (resultFarmer['state'] === 'Ok') {
                    this.View(); 
                  } if(resultFarmer['state'] === 'Fail') {
                  }
                })
              } else if (resultFarm['state'] === 'Fail') {
                this.showDialog = true;
                this.positiveNotification = false;
                this.message = '¡Ha ocurrido un error!';
              } 
            })
          }
          if (this.transporterRegister) {  //Crear Transportador
            this.service.createVehicle(
              plate,
              soatExpiration,
              techExpiration,
              type,
              capacity,
              comments,
            ).subscribe(resultVehicle => {
              if (resultVehicle['state'] === 'Ok') {
                this.service.createTransporter(this.userID, resultVehicle.data.vehID, licenseType, licenseExpiration).subscribe(resultTransport => {
                  if (resultTransport['state'] === 'Ok') {
                    this.View();
                  }if (resultVehicle['state'] === 'Fail') {
                  }
                })
              } else if (resultVehicle['state'] === 'Fail') {
                this.showDialog = true;
                this.positiveNotification = false;
                this.message = '¡Ha ocurrido un error!';
              } 
            })
          }
          if (this.collaboratorRegister) {  //Crear Colaborador
            this.service.createCollab(this.userID, roleNameCollab).subscribe(resultCollab => {
              if (resultCollab['state'] === 'Ok') {
                this.View();
              } else if (resultCollab['state'] === 'Fail') {
                this.showDialog = true;
                this.positiveNotification = false;
                this.message = '¡Ha ocurrido un error!';
              } 
            });
          }
          if (this.assocRegister) {  //Crear Administrador
            this.service.createCollab(this.userID, roleNameAssoc).subscribe(resultAssoc => {
              if (resultAssoc['state'] === 'Ok') {
                this.View();
              } else if (resultAssoc['state'] === 'Fail') {
                this.showDialog = true;
                this.positiveNotification = false;
                this.message = '¡Ha ocurrido un error!';
              }
            });
          }
          break;
        default:
          this.showDialog = true;
          this.positiveNotification = false;
          this.message = '¡Ha ocurrido un error!';
          this.router.navigate(['/']);
      }
    }
  }

  onSelectVehicle(event:any) {
    this.vehID = event.target.value;
  }

  onSelectUserType(event: any) {
    this.selectedValue = event.target.value; // Obtiene el valor seleccionado
    switch (this.selectedValue) {
      case '0':
        this.farmerRegister = true;
        this.assocRegister = false;
        this.collaboratorRegister = false;
        this.transporterRegister = false;
        break;
      
      case '1':
        this.farmerRegister = false;
        this.assocRegister = true;
        this.collaboratorRegister = false;
        this.transporterRegister = false;
        break;

      case '2':
        this.farmerRegister = false;
        this.assocRegister = false;
        this.collaboratorRegister = true;
        this.transporterRegister = false;
        break;

      case '3':
        this.farmerRegister = false;
        this.assocRegister = false;
        this.collaboratorRegister = false;
        this.transporterRegister = true;
        break;

      default:
        this.farmerRegister = false;
        this.transporterRegister = false;
        this.collaboratorRegister = false;
        this.assocRegister = false;
        break;
    }
  }

  getHeaderIcon(): { path: string, viewBox: string } {
    let path: string;
    let viewBox: string;
    switch (this.selectedValue) {
      case '0':
          path = "M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z";
          viewBox = '0 0 576 512';
          break;
      case '1':
          path = "M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h50.7L544 237.3V256H416V160zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z";
          viewBox = '0 0 640 512';
          break;
      case '2':
          path = "M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h50.7L544 237.3V256H416V160zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z";
          viewBox = '0 0 640 512';
          break;
      case '3':
          path = "M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h50.7L544 237.3V256H416V160zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z";
          viewBox = '0 0 640 512';
          break;
      default:
          path = 'M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z'; 
          viewBox = '0 0 576 512';
          break;
    }
    return { path, viewBox };
  }

  getHeader(): string {
    switch (this.selectedValue) {
        case '0':
            return 'Información del predio';
        case '1':
            return 'Información del Asociado';
        case '2':
            return 'Información del Colaborador';
        case '3':
            return 'Detalles de la licencia';
        default:
            return 'Información';
    }
  }
  
  cerrarTodo() {
    this.searchFlag = false;
    this.searchValidator = false;
  }
  
  onSubmitUser(): void {
    if (this.infoUser.valid) {
      const formDataUser = this.infoUser.value;
      this.docTypeaux = formDataUser.docType ?? "";
      this.docNumberaux = formDataUser.docNumber ?? "";

    

      this.service.getUser(this.docTypeaux, this.docNumberaux).subscribe(userData => {
        if (userData['state'] === 'Ok') {
          this.userData = userData.data; // Asigna los datos del usuario a la variable userData
          this.photoFilePath = userData.data.filePicture; // Guarda la ruta de la imagen cargada
          this.documentFilePath = userData.data.fileDocument; // Guarda la ruta de la imagen cargada
          this.rutFilePath = userData.data.fileRUT; // Guarda la ruta de la imagen cargada
          
          this.userID = userData.data.userID;
          this.farmerRegister = false;
          this.transporterRegister = false;
          this.collaboratorRegister = false;
          this.searchFlag = false;
          this.searchValidator = true;
          this.service.getRoles(this.docTypeaux, this.docNumberaux).subscribe(userRoles => {
            if (userRoles['state'] === 'Ok') {
              this.userFarmer = userRoles.data.isFarmer;
              this.userAssoc = userRoles.data.isAdmin;
              this.userTransporter = userRoles.data.isTransporter;
              this.userCollaborator = userRoles.data.isCollab;
              if(this.userFarmer){
                this.service.getFarmer(this.docTypeaux, this.docNumberaux).subscribe(farm => {
                  if (farm['state'] === 'Ok'){
                    this.farmID = farm.data.farm.farmID;
                  }
                });
              }
              if(this.userTransporter){
                this.service.getTransporter(this.docTypeaux, this.docNumberaux).subscribe(transporter => {
                  if (transporter['state'] === 'Ok'){
                    this.plate = transporter.data.vehicles;
                  }
                });
              }
            }else if (userRoles['state'] === 'Fail') {
            }
          });
        } else if ((userData['state'] === 'Fail') && (userData['sessionStatus'] !== 'Session expired')) {
          this.farmerRegister = true;
          this.transporterRegister = false;
          this.collaboratorRegister = false;
          this.searchFlag = true;
          this.searchValidator = false;
          this.userForm.patchValue({
            docType: this.docTypeaux,
            docNumber: this.docNumberaux
          });
        } else if ((userData['state'] === 'Fail') && (userData['sessionStatus'] === 'Session expired')) {
          this.router.navigate(['/']);
        }
      });      
    }
  }

onFileSelected(event: any, folder: string) {
  const file = event.target.files[0];
  if (folder === "farm_ownercertificate" && this.userFarmer) {
    this.ID = this.farmID;
  } else if ((folder === "vehicle_techrev" || folder === "vehicle_runt" || folder === "vehicle_soat") && this.vehID !== '' && this.userTransporter) {
    this.ID = this.vehID;
  } else if (folder === "user_picture" || folder === "user_document" || folder === "user_rut" || folder === "transporter_license"){
    this.ID = this.userID; // Suponiendo que `this.userID` contiene el ID del usuario
  }
  
  if (this.ID !== '') {
    this.service.uploadFile(file, this.ID, folder).subscribe(upload => {
      if (upload['state'] === 'Ok') {
        // Asignar el mensaje de éxito solo al tipo de archivo que se está cargando
        this.uploadStatus[folder] = 'Cargado con éxito';
        // Asignar el filePath según el tipo de archivo cargado
        switch (folder) {
          case 'user_picture':
            this.photoFilePath = upload.filePath;
            break;
          case 'user_document':
            this.documentFilePath = upload.filePath;
            break;
          case 'user_rut':
            this.rutFilePath = upload.filePath;
            break;
           case 'farm_ownercertificate':
            this.ownercertificateFilePath = upload.filePath;
          break;
          // Agregar más casos según los tipos de archivos que tengas
        }
      } else if (upload['state'] === 'Fail') {
        // Asignar el mensaje de error solo al tipo de archivo que se está cargando
        this.uploadStatus[folder] = 'Error al cargar: ' + upload.errmsg;
      }
    });
  } else {
  }
}

  rolesAdd(selectRole:string):void {
    switch (selectRole) {
      case '0':
        this.farmerRegister = true;
        this.assocRegister = false;
        this.collaboratorRegister = false;
        this.transporterRegister = false;
        break;
      
      case '1':
        this.farmerRegister = false;
        this.assocRegister = true;
        this.collaboratorRegister = false;
        this.transporterRegister = false;
        break;

      case '2':
        this.farmerRegister = false;
        this.assocRegister = false;
        this.collaboratorRegister = true;
        this.transporterRegister = false;
        break;

      case '3':
        this.farmerRegister = false;
        this.assocRegister = false;
        this.collaboratorRegister = false;
        this.transporterRegister = true;
        break;

      default:
        this.farmerRegister = false;
        this.transporterRegister = false;
        this.collaboratorRegister = false;
        this.assocRegister = false;
        break;
    }
  }

  areRequiredFieldsValid(): boolean {
    const requiredFields = ['name', 'firstLastname', 'docType', 'docNumber', 'phoneNumber'];
    return requiredFields.every(field => this.userForm.get(field)?.value !== null && this.userForm.get(field)?.value !== '');
  }

  areAgricultorFieldsValid(): boolean {
    const agricultorFields = ['farmName', 'zoneName', 'cityFarm', 'area'];
    return agricultorFields.every(field => this.userForm.get(field)?.value !== null && this.userForm.get(field)?.value !== '');
  }
  
  areAssocFieldsValid(): boolean {
    return this.userForm.get('roleNameAssoc')?.value === 'Admin';
  }
  
  areCollabFieldsValid(): boolean {
    return this.userForm.get('roleNameCollab')?.value === 'Logística';
  }
  
  areTransporterFieldsValid(): boolean {
    const transporterFields = ['licenseType', 'licenseExpiration', 'plate', 'soatExpiration', 'techExpiration', 'type', 'state', 'capacity'];
    return transporterFields.every(field => this.userForm.get(field)?.value !== null && this.userForm.get(field)?.value !== '');
  }
  
}
