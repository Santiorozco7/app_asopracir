import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';

interface FarmInformation {
  farm: {
    GPSposition: string;
    area: string;
    city: string;
    farmID: string;
    farmName: string;
    zoneName: string;
  };
  farmerID: string;
  farmerStatus: number;
  user: {
    address: string;
    altPhoneNumber: string;
    bankAccountBName: string;
    bankAccountNumber: string;
    bankAccountType: string;
    birthday: string;
    city: string;
    docIssueDate: string;
    docIssuePlace: string;
    docNumber: string;
    docType: string;
    email: string;
    firstLastname: string;
    names: string;
    phoneNumber: string;
    secondLastname: string;
    userID: string;
  };
}

@Component({
  selector: 'app-modal-farm',
  templateUrl: './modal-farm.component.html',
  styleUrls: ['./modal-farm.component.css']
})
export class ModalFarmComponent {
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() cerrarActualizar = new EventEmitter<void>();
  @Input() modalVisible: boolean = false;
  @Input() modalData: { numeroDocumento?: string, tipoDocumento?: string } = {};
  formChanges = false;
  originalData: any;
  verificaActualizar:number = 0;

  // Cuadro de diálogo de confirmación
  mostrarDialogo = false;
  
  showDialog = false;
  positiveNotification = true;
  message = '';
  confirmCallback: (() => void) | null = null;

  isStateActive: boolean = false; 

  pictureFilePath: string | null = null;
  documentFilePath: string | null = null;
  rutFilePath: string | null = null;
  fileOwnerCertificateFilePath: string | null = null;

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

  infoUser = this.formBuilder.group({
    name: ['', [Validators.required]],
    firstLastname: ['', [Validators.required]],
    docType: [, [Validators.required]],
    docNumber: ['', [Validators.required]],
    secondLastname: [''],
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

    GPSposition: [''],
    area: [],
    cityFarm: [''],
    farmID: [''],
    farmName: [''],
    zoneName: [''],
    state: []
  });

  constructor(private formBuilder: FormBuilder, private service: AsociacionService) {
    // Suscribirse a los cambios de valor en el formulario
    this.infoUser.valueChanges.subscribe(() => {
      // Obtener los valores actuales del formulario
      const currentFormValues = this.infoUser.value;
      const originalUserData = this.originalData.user;
      const originalFarmData = this.originalData.farm;
      const originalfarmerStatus = this.originalData.farmerStatus;
      // Realizar comparación con los datos originales
      if (currentFormValues.name !== originalUserData.names ||
        currentFormValues.firstLastname !== originalUserData.firstLastname ||
        currentFormValues.docType !== originalUserData.docType ||
        currentFormValues.docNumber !== originalUserData.docNumber ||
        currentFormValues.secondLastname !== originalUserData.secondLastname ||
        currentFormValues.docIssueDate !== originalUserData.docIssueDate ||
        currentFormValues.docIssuePlace !== originalUserData.docIssuePlace ||
        currentFormValues.birthday !== originalUserData.birthday ||
        currentFormValues.address !== originalUserData.address ||
        currentFormValues.city !== originalUserData.city ||
        currentFormValues.phoneNumber !== originalUserData.phoneNumber ||
        currentFormValues.altPhoneNumber !== originalUserData.altPhoneNumber ||
        currentFormValues.email !== originalUserData.email ||
        currentFormValues.bankAccountBName !== originalUserData.bankAccountBName ||
        currentFormValues.bankAccountType !== originalUserData.bankAccountType ||
        currentFormValues.bankAccountNumber !== originalUserData.bankAccountNumber ||
        currentFormValues.GPSposition !== originalFarmData.GPSposition ||
        currentFormValues.area !== originalFarmData.area ||
        currentFormValues.cityFarm !== originalFarmData.city ||
        currentFormValues.farmName !== originalFarmData.farmName ||
        currentFormValues.zoneName !== originalFarmData.zoneName) {
        this.formChanges = true;
        this.verificaActualizar = 1;
        console.log("Hubo cambios en el formulario");
      }

      // Actualizar estado con la asosiacion.
      else if (currentFormValues.state !== originalfarmerStatus) {
        this.formChanges = true;
        this.verificaActualizar = 2;
        console.log("Hubo cambios en el formulario");
        if (currentFormValues.state !== null && currentFormValues.state !== undefined && currentFormValues.state === '1') {
          this.isStateActive = true;
        } else {
          this.isStateActive = false;
        }
      } else {
        this.formChanges = false;
        this.verificaActualizar = 0;
        console.log("No hubo cambios en el formulario");
      }
    });
  }

  closeNotification(): void {
    this.showDialog = false;
  }

  cerrarTodo() {
    this.cerrarModal.emit();
  }

  ngOnChanges(): void {
    console.log(this.modalData);
    if (this.modalData.tipoDocumento !== undefined && this.modalData.numeroDocumento) {
      this.service.getFarmer(this.modalData.tipoDocumento, this.modalData.numeroDocumento).subscribe(infoFarmer=>{
        if (infoFarmer['state'] === 'Ok') {
          this.originalData = { ...infoFarmer.data };
          console.log("datos originales: ", this.originalData);

          // Asignar los valores recibidos del servicio al formulario
          const userData = infoFarmer.data.user; 
          const farmData = infoFarmer.data.farm;
          const farmerStatus = infoFarmer.data.farmerStatus;

          this.pictureFilePath = userData.filePicture;
          this.documentFilePath = userData.fileDocument;
          this.rutFilePath = userData.fileRUT;
          this.fileOwnerCertificateFilePath = farmData.fileOwnerCertificate;

          console.log(farmerStatus);
          this.infoUser.patchValue({
            name: userData.names,
            firstLastname: userData.firstLastname,
            docType: userData.docType,
            docNumber: userData.docNumber,
            secondLastname: userData.secondLastname,
            docIssueDate: userData.docIssueDate,
            docIssuePlace: userData.docIssuePlace,
            birthday: userData.birthday,
            address: userData.address,
            city: userData.city,
            phoneNumber: userData.phoneNumber,
            altPhoneNumber: userData.altPhoneNumber,
            email: userData.email,
            bankAccountBName: userData.bankAccountBName,
            bankAccountType: userData.bankAccountType,
            bankAccountNumber: userData.bankAccountNumber,

            GPSposition: farmData.GPSposition,
            area: farmData.area,
            cityFarm: farmData.city,
            farmName: farmData.farmName,
            zoneName: farmData.zoneName,
            
            state: farmerStatus
          });
          if (this.infoUser.value.state !== null && this.infoUser.value.state !== undefined && this.infoUser.value.state === '1') {
            this.isStateActive = true;
          } else {
            this.isStateActive = false;
          }
          console.log("este es el estado del ususrio: ",this.infoUser.value);
      } else {
          console.log("El estado no es 'Ok'");
          console.log(infoFarmer);
      }
      });
    }
  }

  openDocument(filePath: string) {
    if (filePath) {
      window.open('http://localhost/uqplatanos/' + filePath, '_blank');
    }
  }

  onSubmit(): void {
    if (this.infoUser.valid) {
      const formData = this.infoUser.value;
      const name: string = formData.name ?? "";
      const firstLastname: string = formData.firstLastname ?? "";
      const docType: string = formData.docType ?? "";
      const docNumber: string = formData.docNumber ?? "";
      const secondLastname: string = formData.secondLastname ?? "";
      const docIssueDate: string = formData.docIssueDate ?? "";
      const docIssuePlace: string = formData.docIssuePlace ?? "";
      const birthday: string = formData.birthday ?? "";
      const address: string = formData.address ?? "";
      const city: string = formData.city ?? "";
      const phoneNumber: string = formData.phoneNumber ?? "";
      const altPhoneNumber: string = formData.altPhoneNumber ?? "";
      const email: string = formData.email ?? "";
      const bankAccountBName: string = formData.bankAccountBName ?? "";
      const bankAccountType: string = formData.bankAccountType ?? "";
      const bankAccountNumber: string = formData.bankAccountNumber ?? "";

      const GPSposition: string = formData.GPSposition ?? "";
      const area: string = formData.area ?? "";
      const cityFarm: string = formData.cityFarm ?? "";
      const farmName: string = formData.farmName ?? "";
      const zoneName: string = formData.zoneName ?? "";

      const farmerStatus:string = formData.state ?? "";

      if (this.verificaActualizar === 1) {
        this.service.updateUser(
          this.originalData.user.userID,
          name,
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
        ).subscribe(result => {
          if (result['state'] === 'Ok') {
            console.log('Usuario Actualizado');
            this.service.updateFarm(
              this.originalData.farm.farmID,
              farmName,
              zoneName,
              cityFarm,
              area,
              GPSposition
            ).subscribe(resultFarm => {
              if (resultFarm['state'] === 'Ok') {
                console.log('Finca Actualizada');
                this.showDialog = true;
                this.positiveNotification = true;
                this.message = `Se han actualizado los datos `;
                this.cerrarActualizar.emit();
              }if(resultFarm['state'] === 'Fail') {
                console.log('Finca no Actualizada');
                this.showDialog = true;
                this.positiveNotification = false;
                this.message = `No se ha podido actualizar`;
              }
            });
          }if(result['state'] === 'Fail') {
            console.log('Usuario no fue Actualizado');
            this.showDialog = true;
            this.positiveNotification = false;
            this.message = `No se ha podido actualizar`;
          }
        });
      }

      if (this.verificaActualizar === 2) {
        this.service.setFarmerStatus(this.originalData.farmerID, farmerStatus).subscribe(result => {
          if (result['state'] === 'Ok') {
            console.log('Finca Actualizada');
            this.cerrarActualizar.emit();
          }if(result['state'] === 'Fail') {
            console.log('Finca no Actualizada');
          }
        });
      }
      this.cerrarModal.emit();
    }
  }
}
