import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-vehicle',
  templateUrl: './create-vehicle.component.html',
  styleUrls: ['./create-vehicle.component.css']
})
export class CreateVehicleComponent {
  @Output() cerrarcreateVehicle = new EventEmitter<void>();
  @Output() cerrarActualizar = new EventEmitter<void>();
  @Input() createVehicleVisible: boolean = false;
  
  userIDaux:string = '';
  activVehicle:boolean = false;
  activSpan:boolean = false;

  // Cuadro de diálogo de confirmación
  mostrarDialogo = false;
  mensaje = '';
  confirmCallback: (() => void) | null = null;

  docTypeselect: any[] = [
    { id: 0, name: 'Cédula de ciudadanía' },
    { id: 1, name: 'Cédula de extranjería' },
    { id: 2, name: 'NIT' },
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

  infoUser = this.formBuilder.group({
    docType: [''],
    docNumber: ['']
  });

  infoVehicle = this.formBuilder.group({
    licenseExpiration: ['', [Validators.required]],
    licenseType: ['', [Validators.required]],

    plate: ['', [Validators.required]],
    soatExpiration: ['', [Validators.required]],
    techExpiration: ['', [Validators.required]],
    type: ['', [Validators.required]],
    capacity: ['', [Validators.required]],
    comments: ['']
  });

  constructor(private formBuilder: FormBuilder, private service: AsociacionService, private router: Router) {
    this.infoUser.valueChanges.subscribe(() => {
      if (this.infoUser.value.docNumber !== this.infoUser.value.docNumber ||
        this.infoUser.value.docType !== this.infoUser.value.docType) {
        this.activVehicle = false;
      }
    });
  }

  cerrarTodo() {
    this.cerrarcreateVehicle.emit();
  }

  ngOnChanges(): void {
    
  }

  onSubmitUser(): void {
    if (this.infoUser.valid) {
      const formDataUser = this.infoUser.value;
      const docType: string = formDataUser.docType ?? "";
      const docNumber: string = formDataUser.docNumber ?? "";

      // console.log(formDataUser);

      this.service.getUser(docType, docNumber).subscribe(userData => {
        if (userData['state'] === 'Ok') {
          this.userIDaux = userData.data.userID;
          this.activVehicle = true;
          this.activSpan = false;
          console.log(userData.data.userID);
        }if(userData['state'] === 'Fail') {
          this.activSpan = true;
          console.log('Algo salio mal');
        }
      });

      
    }
  }

  onSubmit(): void {
    if (this.infoVehicle.valid) {
      const formData = this.infoVehicle.value;
      const licenseExpiration: string = formData.licenseExpiration ?? "";
      const licenseType: string = formData.licenseType ?? "";
      
      const plate: string = formData.plate ?? "";
      const soatExpiration: string = formData.soatExpiration ?? "";
      const techExpiration: string = formData.techExpiration ?? "";
      const type: string = formData.type ?? "";
      const capacity: string = formData.capacity ?? "";
      const comments: string = formData.comments ?? "";

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
          this.service.createTransporter(this.userIDaux, resultVehicle.data.vehID, licenseType, licenseExpiration).subscribe(resultTransport => {
            if (resultTransport['state'] === 'Ok') {
              console.log("Transportador Creado");
              this.cerrarActualizar.emit();
            }if (resultVehicle['state'] === 'Fail') {
              console.log("Trasnportador no creado");
            }
          })
        }if (resultVehicle['state'] === 'Fail') {
          console.log("Vehiculo no creado");
        }
      })
      this.cerrarcreateVehicle.emit();
    }
  }
}
