import { Component, Renderer2, ElementRef } from '@angular/core';
import { AgricultorService } from '../../agricultor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent {
  historial: any[] = [];
  detallesHistorial: any = {};

  constructor(private service: AgricultorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit(): void{
    this.View();
  }

  // Se cambio el View
  View() {
    this.service.historial().subscribe(HT => {
      if (HT['state'] === 'Fail') {
        this.router.navigate(['/']);
      }
      this.historial = HT.data;
    });  
  }

  getMonthName(monthNumber: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthNumber - 1]; // Restamos 1 porque los meses en JavaScript comienzan desde 0
  }
  
  // Modal -----------------------------------------------------------
  historialVisible = false;

  mostrarHistorial(detallesHistorial:string) {
    this.historialVisible = true;
    this.detallesHistorial = detallesHistorial;
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal-open'); // Agrega la clase al body
  }

  cerrarHistorial() {
    this.historialVisible = false;
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open'); // Elimina la clase al cerrar
  }
}
