import { Component, Input, Output, EventEmitter, Renderer2, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgricultorService } from '../../agricultor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-cinta',
  templateUrl: './crear-cinta.component.html',
  styleUrls: ['./crear-cinta.component.css']
})
export class CrearCintaComponent {
  @Input() lote: any[] = [];
  @Input() showCreateTape: boolean = false;
  @Output() tapeCreated = new EventEmitter<void>();
  @Output() closeCreateTape = new EventEmitter<void>();

  showDialog = false;
  message = '';
  
  constructor(private formBuilder: FormBuilder, private service: AgricultorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {}

  loteForm = this.formBuilder.group({
    batchID: ['', [Validators.required]],
    numBunches: ['', [Validators.required]],
    variety: ['', [Validators.required]],
    color: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loteForm.valid) {
      const formData = this.loteForm.value;
      const batchID: any = formData.batchID ?? "";
      const numBunches: any = formData.numBunches ?? "";
      const variety: string = formData.variety ?? "";
      // Obtén el valor del campo "color" y quita el símbolo '#' si está presente
      const colorValue: any = formData.color ?? "";
      const colorWithoutHash: string = colorValue.startsWith('#') ? colorValue.substring(1) : colorValue;
      // Utiliza colorWithoutHash en tu solicitud al servidor
      this.service.createTape(batchID, numBunches, variety, colorWithoutHash).subscribe(tapeCreated => {
        if (tapeCreated['state'] === 'Ok') {
          this.tapeCreated.emit();
          this.showNotification(`Se ha creado una nueva cinta`);
        } else {
          this.tapeCreated.emit();
          this.showNotification(`¡Ha occurido un error!"`);
        }
      });
    }
    this.closeCreateTape.emit();
  }

  getCreateTapeIconClass(): string {
    return this.loteForm.valid? 'fa-triangle-exclamation' : 'fa-lock';
  }
  
  getCreateTapeButtonMessage(): string {
    return this.loteForm.valid? 'Crear cinta' : 'Bloqueado';
  }

  showNotification(message: string) {
    this.showDialog = true;
    this.message = message;
    setTimeout(() => {
      this.showDialog = false;
    }, 3000);
  }

  closeDialog(event: Event): void {
    // Verifica si el clic se realizó fuera del contenido del modal
    if (event.target === event.currentTarget) {
      this.closeCreateTape.emit();
      this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
    }
  }
}
