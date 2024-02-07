import { Component, Input, Output, EventEmitter, Renderer2, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal-production',
  templateUrl: './modal-production.component.html',
  styleUrls: ['./modal-production.component.css']
})
export class ModalProductionComponent {
  @Input() showModalHistory: boolean = false;
  @Input() historyDetails: any = {};

  @Output() closeModalHistory = new EventEmitter<void>();

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnChanges() {}

  cerrarTodo() {
    this.closeModalHistory.emit();
  }
}
