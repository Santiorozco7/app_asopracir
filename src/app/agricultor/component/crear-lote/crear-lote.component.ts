import { Component, Input, Output, EventEmitter, Renderer2, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgricultorService } from '../../agricultor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-lote',
  templateUrl: './crear-lote.component.html',
  styleUrls: ['./crear-lote.component.css']
})

export class CrearLoteComponent {
  @Input() showCreateBatch: boolean = false;
  @Output() batchCreated = new EventEmitter<void>();
  @Output() closeCreateBatch = new EventEmitter<void>();

  showDialog = false;
  message = '';

  constructor(private formBuilder: FormBuilder, private service: AgricultorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {}

  loteForm = this.formBuilder.group({
    batchName: ['', [Validators.required]],
    responsible: ['', [Validators.required]],
    mainVariety: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loteForm.valid) {
      const formData = this.loteForm.value;
      const batchName: string = formData.batchName ?? "";
      const responsible: string = formData.responsible ?? "";
      const mainVariety: string = formData.mainVariety ?? "";
      this.service.createBatch(batchName, responsible, mainVariety).subscribe(batchCreated => {
        if (batchCreated['state'] === 'Ok') {
          this.batchCreated.emit();
          this.showNotification(`Se ha creado el lote "${batchName}"`);
        } else {
          this.batchCreated.emit();
          this.showNotification(`¡Ha occurido un error!"`);
        }
      });
    }
    this.closeCreateBatch.emit();
  }

  getCreateBatchIconClass(): string {
    return this.loteForm.valid? 'fa-triangle-exclamation' : 'fa-lock';
  }
  
  getCreateBatchButtonMessage(): string {
    return this.loteForm.valid? 'Crear lote' : 'Bloqueado';
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
      this.closeCreateBatch.emit();
      this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
    }
  }
}
