import { Component, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { ModalProductionComponent } from '../../component/modal-production/modal-production.component';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css']
})
export class ProductionComponent {
  @ViewChild(ModalProductionComponent) updateModal!: ModalProductionComponent;
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
      this.View();
    });
  }

  ngOnInit(): void{
    this.View();
  }

  // Se cambio el View
  View() {
    this.service.getStats("lastyear").subscribe(stats => {
      if (stats['state'] === 'Ok') {
        this.verificacionHistorial = false;
        this.history = stats.data;
      } else if ((stats['state'] === 'Fail') && (stats['sessionStatus'] !== 'Session expired')) {
        this.verificacionHistorial = true;
      } else if ((stats['state'] === 'Fail') && (stats['sessionStatus'] === 'Session expired')) {
        this.authService.logout();
        this.router.navigate(['/']);
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
    this.updateModal.update(historyDetails);
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal--open'); 
  }

  closeModalHistory() {
    this.showModalHistory = false;
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
  }
}
