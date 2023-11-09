import { Component } from '@angular/core';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-farms',
  templateUrl: './farms.component.html',
  styleUrls: ['./farms.component.css']
})
export class FarmsComponent {
  farms: any[] = [];

  constructor(private service: AsociacionService, private router: Router) {
  }

  ngOnInit(): void{
    this.View();
  }

  View() {
    this.service.getFarms().subscribe(farms => {
      if (farms['state'] === 'Fail') {
        this.router.navigate(['/']);
      }else{
        this.farms = farms.data;
        console.log(farms.data);
      }
    });
  }

  // Modal -----------------------------------------------------------
  modalVisible = false;
  modalData: { numeroDocumento?: number, tipoDocumento?: number } = {};

  mostrarModal(numeroDocumento?: number, tipoDocumento?: number) {
    this.modalData = { numeroDocumento, tipoDocumento };
    // console.log(this.modalData.numeroDocumento, this.modalData.tipoDocumento);
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }
}
