import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';

interface Vehicle {
  capacity?: string;
  comments: string;
  fileRUNT: string;
  fileSOAT: string;
  fileTechRev: string;
  plate: string;
  soatExpiration: string;
  state: string;
  techExpiration: string;
  type: string;
  vehID: string;
  // Otros campos que tenga tu objeto de vehículo
}

@Component({
  selector: 'app-modal-transport',
  templateUrl: './modal-transport.component.html',
  styleUrls: ['./modal-transport.component.css']
})
export class ModalTransportComponent {
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() cerrarActualizar = new EventEmitter<void>();
  @Input() modalVisible: boolean = false;
  @Input() modalData: { numeroDocumento?: number, tipoDocumento?: number, placa?: string } = {};
  formChanges = false;
  originalData: any;
  originalVehicle: number = 0;

  // Cuadro de diálogo de confirmación
  mostrarDialogo = false;

  showDialog = false;
  positiveNotification = true;
  message = '';
  confirmCallback: (() => void) | null = null;

  pictureFilePath: string | null = null;
  documentFilePath: string | null = null;
  rutFilePath: string | null = null;
  runtFilePath: string | null = null;
  soatFilePath: string | null = null;
  techrevFilePath: string | null = null;

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

  vehicles: Vehicle[] = [];

  infoUser = this.formBuilder.group({
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

    licenseExpiration: [''],
    licenseType: [''],
    comments: [''],

    plate: [''],
    soatExpiration: [''],
    techExpiration: [''],
    type: [''],
    state: [''],
    capacity: [''],
    commentsVeh: ['']
  });

  constructor(private formBuilder: FormBuilder, private service: AsociacionService, private router: Router) {
    // Suscribirse a los cambios de valor en el formulario
    this.infoUser.valueChanges.subscribe(() => {
      // Obtener los valores actuales del formulario
      const currentFormValues = this.infoUser.value;
      const originalUserData = this.originalData.user;
      const originalTransporterData = this.originalData.transporter;
      const originalvehiclesData = this.vehicles[0];
      // console.log(currentFormValues.name);
      // console.log(this.originalData.user.names);
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
        currentFormValues.licenseExpiration !== originalTransporterData.licenseExpiration ||
        currentFormValues.licenseType !== originalTransporterData.licenseType ||
        currentFormValues.comments !== originalTransporterData.comments ||
        currentFormValues.plate !== originalvehiclesData.plate ||
        currentFormValues.soatExpiration !== originalvehiclesData.soatExpiration ||
        currentFormValues.techExpiration !== originalvehiclesData.techExpiration ||
        currentFormValues.type !== originalvehiclesData.type ||
        currentFormValues.state !== originalvehiclesData.state ||
        currentFormValues.capacity !== originalvehiclesData.capacity ||
        currentFormValues.commentsVeh !== originalvehiclesData.comments) {
        this.formChanges = true;
        console.log("Hubo cambios en el formulario");
      } else {
        this.formChanges = false;
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
      // console.log("tipo de documento",this.modalData.numeroDocumento);
      // console.log("numero de documento",this.modalData.tipoDocumento);
      this.service.getTransporter(this.modalData.tipoDocumento.toString(), this.modalData.numeroDocumento.toString()).subscribe(infoTransporter=>{
        if (infoTransporter['state'] === 'Ok') {
          this.originalData = { ...infoTransporter.data };
          // aqui estaba lo de la placa
          
          console.log("El indice del vehiculo: ", this.originalVehicle); // -----------------------------------------
          console.log("datos originales: ", this.originalData.transID);
          // console.log("El estado es 'Ok'");
          console.log(infoTransporter.data);
          // Asignar los valores recibidos del servicio al formulario
          const userData = infoTransporter.data.user; 
          const transporterData = infoTransporter.data.transporter;
          const vehiclesData = infoTransporter.data.vehicles;
          
          this.pictureFilePath = userData.filePicture;
          this.documentFilePath = userData.fileDocument;
          this.rutFilePath = userData.fileRUT;

          this.runtFilePath = vehiclesData.fileRUNT;
          this.soatFilePath = vehiclesData.fileSOAT;
          this.techrevFilePath = vehiclesData.fileTechRev;

          // Se obtiene todo los datos del vehículo que pertenece a la placa
          this.vehicles = vehiclesData.filter((vehicle:Vehicle) => vehicle.plate === this.modalData.placa);
          console.log('Vehículo encontrado:', this.vehicles);

          // const vehiclesAux = vehiclesData[0];
          console.log("vehiculos: ",vehiclesData);
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

            licenseExpiration: transporterData.licenseExpiration,
            licenseType: transporterData.licenseType,
            comments: transporterData.comments,

            plate: this.vehicles[0].plate,
            soatExpiration: this.vehicles[0].soatExpiration,
            techExpiration: this.vehicles[0].techExpiration,
            type: this.vehicles[0].type,
            state: this.vehicles[0].state,
            capacity: this.vehicles[0].capacity,
            commentsVeh: this.vehicles[0].comments
          });
      } else {
          console.log("El estado no es 'Ok'");
          console.log(infoTransporter);
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

      const licenseExpiration: string = formData.licenseExpiration ?? "";
      const licenseType: string = formData.licenseType ?? "";
      const comments: string = formData.comments ?? "";
      
      const plate: string = formData.plate ?? "";
      const soatExpiration: string = formData.soatExpiration ?? "";
      const techExpiration: string = formData.techExpiration ?? "";
      const type: string = formData.type ?? "";
      const state: string = formData.state ?? "";
      const capacity: string = formData.capacity ?? "";
      const commentsVeh: string = formData.commentsVeh ?? "";

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
          this.service.updateVehicle(
            this.vehicles[0].vehID,
            plate,
            soatExpiration,
            techExpiration,
            type,
            capacity,
            commentsVeh,
            state
          ).subscribe(resultVeh => {
            if (resultVeh["state"] === 'Ok') {
              console.log('Vehículo Actualizado');
              this.service.updateTransporter(
                this.originalData.transID,
                licenseType,
                licenseExpiration,
                comments
              ).subscribe(resultTrans => {
                if (resultTrans["state"] === 'Ok') {
                  console.log('Transportador Actualizado');
                  this.showDialog = true;
                  this.positiveNotification = true;
                  this.message = `Se han actualizado los datos`;
                  this.cerrarActualizar.emit();
                }if(resultVeh['state'] === 'Fail') {
                  console.log('Transportador no fue Actualizado');
                  this.showDialog = true;
                  this.positiveNotification = false;
                  this.message = `No se ha podido actualizar`;
                }
              });
            }if(resultVeh['state'] === 'Fail') {
              console.log('Vehículo no fue Actualizado');
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
      this.cerrarModal.emit();
    }
  }
}
