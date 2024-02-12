import { Component, Renderer2, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AsociacionService } from '../../asociacion.service';
import { Router } from '@angular/router';

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

  constructor(private formBuilder: FormBuilder, private service: AsociacionService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
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
    this.service.getStats(this.stateValue).subscribe(HT => {
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
