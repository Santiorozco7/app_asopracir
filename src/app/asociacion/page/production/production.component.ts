import { Component, Renderer2, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css']
})
export class ProductionComponent {
  history: any[] = [];
  historyDetails: any = {};
  verificacionHistorial:boolean = false;
  stateValue:string = "all";

  showModalHistory = false;
  infoUser = this.formBuilder.group({
    state: ['all'] 
  });

  constructor(private formBuilder: FormBuilder, private service: AsociacionService, private router: Router, private renderer: Renderer2, private el: ElementRef, private authService: AuthService) {
    this.infoUser.valueChanges.subscribe(() => {
      this.stateValue = this.infoUser.value.state ?? 'all';
      console.log(this.stateValue);
      this.View();
    });
  }

  ngOnInit(): void{
    this.View();
  }

  // Se cambio el View
  View() {
    this.service.getStats(this.stateValue).subscribe(stats => {
      if (stats['state'] === 'Ok') {
        this.verificacionHistorial = false;
        this.history = stats.data;
        console.log("Este es el historial:",stats.data);
      } else if ((stats['state'] === 'Fail') && (stats['sessionStatus'] !== 'Session expired')) {
        console.log("No hay ordenes para mostrar", stats);
        this.verificacionHistorial = true;
      } else if ((stats['state'] === 'Fail') && (stats['sessionStatus'] === 'Session expired')) {
        this.authService.logout();
        this.router.navigate(['/']);
        console.log('No hay session',stats);
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
