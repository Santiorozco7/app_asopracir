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

  closeDialog(event: Event): void {
    // Verifica si el clic se realizó fuera del contenido del modal
    if (event.target === event.currentTarget) {
      this.closeModalHistory.emit();
      this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
    }
  }
}