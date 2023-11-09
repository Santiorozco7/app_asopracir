import { Component } from '@angular/core';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  Transporters: any[] = [];

  typeSelect: { [key: number]: string } = {
    0: 'Sencillo',
    1: 'Camioneta estacas',
    2: 'Camioneta platón',
    3: 'Turbo',
    4: 'Furgoneta',
    5: 'Dobletroque',
    6: 'Minimula',
    7: 'Tractomula',
  };

  constructor(private service: AsociacionService, private router: Router) {
  }

  ngOnInit(): void{
    this.View();
  }

  View() {
    this.service.getTransporters().subscribe(Transporters => {
      if (Transporters['state'] === 'Fail') {
        this.router.navigate(['/']);
      } else {
        this.Transporters = Transporters.data;
      console.log(Transporters.data);
      }  
    });
  }
  // Modal -----------------------------------------------------------
  modalVisible = false;
  modalData: { numeroDocumento?: number, tipoDocumento?: number, placa?: string} = {};

  mostrarModal(numeroDocumento?: number, tipoDocumento?: number, placa?: string) {
    this.modalData = { numeroDocumento, tipoDocumento, placa };
    // console.log(this.modalData.numeroDocumento, this.modalData.tipoDocumento);
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  //Modal para crear vehículo
  createVehicleVisible = false;

  mostrarcreateVehicle() {
    // console.log(this.modalData.numeroDocumento, this.modalData.tipoDocumento);
    this.createVehicleVisible = true;
  }

  cerrarcreateVehicleVisible() {
    this.createVehicleVisible = false;
  }
}
