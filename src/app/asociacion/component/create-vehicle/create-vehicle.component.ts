import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

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
  activPlate:boolean = false;
  transID?:number;
  plateValue: string = '';

  // Cuadro de diálogo de confirmación
  mostrarDialogo = false;
  mensaje = '';
  confirmCallback: (() => void) | null = null;

  docTypeselect: any[] = [
    { id: 0, name: 'Cédula de ciudadanía' },
    { id: 1, name: 'Tarjeta de Identidad' },
    { id: 2, name: 'Cédula de Extranjería' },
    { id: 3, name: 'NIT' },
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
    docType: ['', Validators.required],
    docNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
  });

  infoVehicle = this.formBuilder.group({
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
    this.infoUser.setValue({
      docType: '',
      docNumber: ''
    });
    this.infoVehicle.setValue({
      plate: '',
      soatExpiration: '',
      techExpiration: '',
      type: '',    
      capacity: '',
      comments: ''
    });
    this.transID = undefined;
    this.activVehicle = false;
    this.activPlate = false;
    this.cerrarcreateVehicle.emit();
  }

  ngOnInit(): void {
    this.infoVehicle.get('plate')?.valueChanges
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

  onSubmitUser(): void {
    if (this.infoUser.valid) {
      const formDataUser = this.infoUser.value;
      const docType: string = formDataUser.docType ?? "";
      const docNumber: string = formDataUser.docNumber ?? "";

    

      this.service.getTransporter(docType, docNumber).subscribe(userData => {
        if (userData['state'] === 'Ok') {
          this.userIDaux = userData.data.user.userID;
          this.transID = userData.data.transID;
          this.activVehicle = true;
          this.activSpan = false;
        }if(userData['state'] === 'Fail') {
          this.activSpan = true;
        }
      });

      
    }
  }

  onSubmit(): void {
    if (this.infoVehicle.valid) {
      const formData = this.infoVehicle.value;
      
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
          this.service.createTransporter(this.userIDaux, resultVehicle.data.vehID).subscribe(resultTransport => {
            if (resultTransport['state'] === 'Ok') {
              this.cerrarActualizar.emit();
            }if (resultVehicle['state'] === 'Fail') {
              this.cerrarActualizar.emit();
            }
          });
        }if (resultVehicle['state'] === 'Fail') {
        }
      });
      this.cerrarcreateVehicle.emit();
    }
  }
}
