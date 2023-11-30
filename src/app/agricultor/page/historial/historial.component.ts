import { Component, Renderer2, ElementRef } from '@angular/core';
import { AgricultorService } from '../../agricultor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent {
  history: any[] = [];
  historyDetails: any = {};
  verificacionHistorial:boolean = false;

  showModalHistory = false;

  constructor(private service: AgricultorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void{
    this.View();
  }

  // Se cambio el View
  View() {
    this.service.getStats().subscribe(HT => {
      if (HT['state'] === 'Fail') {
        this.verificacionHistorial = true;
        console.log("No hay información en historial", HT);
        // this.router.navigate(['/']);
      }
      if (HT['state'] === 'Ok') {
        this.verificacionHistorial = false;
        this.history = HT.data;
        console.log("Este es el historial:",HT.data);
      }
    });  
  }

  getMonthName(monthNumber: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthNumber - 1]; // Restamos 1 porque los meses en JavaScript comienzan desde 0
  }

  modalHistory(historyDetails:string) {
    this.showModalHistory = true;
    this.historyDetails = historyDetails;
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal--open'); 
  }

  closeModalHistory() {
    this.showModalHistory = false;
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
  }
}
