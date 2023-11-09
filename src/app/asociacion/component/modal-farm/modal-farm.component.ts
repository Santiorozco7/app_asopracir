import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-farm',
  templateUrl: './modal-farm.component.html',
  styleUrls: ['./modal-farm.component.css']
})
export class ModalFarmComponent {
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() cerrarActualizar = new EventEmitter<void>();
  @Input() modalVisible: boolean = false;
  @Input() modalData: { numeroDocumento?: number, tipoDocumento?: number } = {};
  editareliminar: boolean = false;
  formChanges = false;
  originalData: any;

  // Cuadro de diálogo de confirmación
  mostrarDialogo = false;
  mensaje = '';
  confirmCallback: (() => void) | null = null;

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

    GPSposition: [''],
    area: [],
    cityFarm: [''],
    farmID: [''],
    farmName: [''],
    fileOwnerCertificate: [''],
    zoneName: ['']
  });

  constructor(private formBuilder: FormBuilder, private service: AsociacionService, private router: Router) {
    // Suscribirse a los cambios de valor en el formulario
    this.infoUser.valueChanges.subscribe(() => {
      // Obtener los valores actuales del formulario
      const currentFormValues = this.infoUser.value;
      const originalUserData = this.originalData.user;
      const originalFarmData = this.originalData.farm;
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
        currentFormValues.GPSposition !== originalFarmData.GPSposition ||
        currentFormValues.area !== originalFarmData.area ||
        currentFormValues.cityFarm !== originalFarmData.city ||
        currentFormValues.farmName !== originalFarmData.farmName ||
        currentFormValues.fileOwnerCertificate !== originalFarmData.fileOwnerCertificate ||
        currentFormValues.zoneName !== originalFarmData.zoneName) {
        this.formChanges = true;
        console.log("Hubo cambios en el formulario");
      } else {
        this.formChanges = false;
        console.log("No hubo cambios en el formulario");
      }
    });
  }

  cerrarTodo() {
    this.cerrarModal.emit();
  }

  ngOnChanges(): void {
    console.log(this.modalData);
    if (this.modalData.tipoDocumento !== undefined && this.modalData.numeroDocumento) {
      // console.log("tipo de documento",this.modalData.numeroDocumento);
      // console.log("numero de documento",this.modalData.tipoDocumento);
      this.service.getFarmer(this.modalData.tipoDocumento, this.modalData.numeroDocumento).subscribe(infoFarmer=>{
        if (infoFarmer['state'] === 'Ok') {
          this.originalData = { ...infoFarmer.data };
          console.log("datos originales: ", this.originalData.farm.farmID);
          // console.log("El estado es 'Ok'");
          // console.log(infoFarmer.data);
          // Asignar los valores recibidos del servicio al formulario
          const userData = infoFarmer.data.user; 
          const farmData = infoFarmer.data.farm;
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
            fileOwnerCertificate: farmData.fileOwnerCertificate,
            zoneName: farmData.zoneName,
          });
      } else {
          console.log("El estado no es 'Ok'");
          console.log(infoFarmer);
      }
      });
    }
  }

  onSubmit(): void {
    if (this.infoUser.valid) {
      const formData = this.infoUser.value;
      // const batchName: string = formData.batchName ?? "";
      // const responsible: string = formData.responsible ?? "";
      // const mainVariety: string = formData.mainVariety ?? "";
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
      const fileOwnerCertificate: string = formData.fileOwnerCertificate ?? "";
      const zoneName: string = formData.zoneName ?? "";

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
              this.cerrarActualizar.emit();
            }if(resultFarm['state'] === 'Fail') {
              console.log('Finca no Actualizada');
            }
          });
        }if(result['state'] === 'Fail') {
          console.log('Usuario no fue Actualizado');
        }
      });
      this.cerrarModal.emit();
    }
  }

  editarEliminar() {
    this.editareliminar = !this.editareliminar;
  }

}
