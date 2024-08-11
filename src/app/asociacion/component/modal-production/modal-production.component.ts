import { Component, Input, Output, EventEmitter, Renderer2, ElementRef, HostListener } from '@angular/core';
import { AsociacionService } from '../../asociacion.service';

@Component({
  selector: 'app-modal-production',
  templateUrl: './modal-production.component.html',
  styleUrls: ['./modal-production.component.css']
})
export class ModalProductionComponent {
  @Input() showModalHistory: boolean = false;
  @Input() historyDetails: any = {};
  orderDetails: any[] = [];

  @Output() closeModalHistory = new EventEmitter<void>();

  constructor(private renderer: Renderer2, private el: ElementRef, private service: AsociacionService) {
  }

  ngOnChanges() {
    
  }

  update(details:any) {
    this.service.getDetailedStats(details.Month, details.Year).subscribe(orderDetails => {
     this.orderDetails = orderDetails.data;
    });
  }

  cerrarTodo() {
    this.closeModalHistory.emit();
  }
}
