import { Component, Input, Output, EventEmitter, Renderer2, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgricultorService } from '../../agricultor.service';
import { Router } from '@angular/router';

interface Lote {
  batchID: string;
  batchName: string;
  responsible: string;
  mainVariety: string;
}

@Component({
  selector: 'app-crear-cinta',
  templateUrl: './crear-cinta.component.html',
  styleUrls: ['./crear-cinta.component.css']
})
export class CrearCintaComponent {
  @Input() lote: Lote[] = [];
  @Input() showCreateTape: boolean = false;
  @Output() tapeCreated = new EventEmitter<void>();
  @Output() closeCreateTape = new EventEmitter<void>();

  showDialog = false;
  positiveNotification = true;
  message = '';
  
  constructor(private formBuilder: FormBuilder, private service: AgricultorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {}

  loteForm = this.formBuilder.group({
    batchID: ['', [Validators.required]],
    numBunches: ['', [Validators.required]],
    variety: ['', [Validators.required]],
    color: ['#000000', [Validators.required]]
  });
  
  closeNotification(): void {
    this.showDialog = false;
  }

  onSubmit(): void {
    if (this.loteForm.valid) {
      const formData = this.loteForm.value;
      const batchID: string = formData.batchID ?? "";
      const numBunches: string = formData.numBunches ?? "";
      const variety: string = formData.variety ?? "";
      // Obtén el valor del campo "color" y quita el símbolo '#' si está presente
      const colorValue: any = formData.color ?? "";
      const colorWithoutHash: string = colorValue.startsWith('#') ? colorValue.substring(1) : colorValue;
      // Utiliza colorWithoutHash en tu solicitud al servidor
      this.service.createTape(batchID, numBunches, variety, colorWithoutHash).subscribe(tapeCreated => {
        if (tapeCreated['state'] === 'Ok') {
          this.tapeCreated.emit();
          this.showDialog = true;
          this.positiveNotification = true;
          this.message = `Se ha creado una nueva cinta`;
        } else {
          this.tapeCreated.emit();
          this.showDialog = true;
          this.positiveNotification = false;
          this.message = '¡Ha ocurrido un error!';
        }
      });
    }
    this.closeCreateTape.emit();
  }

  getCreateTapeIcon(): { path: string, viewBox: string } {
    const path = this.loteForm.valid
    ? "M144 144c0-44.2 35.8-80 80-80c31.9 0 59.4 18.6 72.3 45.7c7.6 16 26.7 22.8 42.6 15.2s22.8-26.7 15.2-42.6C331 33.7 281.5 0 224 0C144.5 0 80 64.5 80 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H144V144z" 
    : "M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z";
    
    const viewBox = this.loteForm.valid
    ? '0 0 448 512'
    : '0 0 448 512';
    return { path, viewBox };
  }
  
  getCreateTapeButtonMessage(): string {
    return this.loteForm.valid? 'Crear cinta' : 'Bloqueado';
  }

  closeDialog(event: Event): void {
    // Verifica si el clic se realizó fuera del contenido del modal
    if (event.target === event.currentTarget) {
      this.closeCreateTape.emit();
      this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
      this.resetForm();
      // reiniar variables
    }
  }

  allClose(){
    this.closeCreateTape.emit();
    this.resetForm();
    // reiniar variables
  }

  resetForm() {
    this.loteForm.reset({
      batchID: '',
      numBunches: '',
      variety: '',
      color: '#000000'
    });
  }
}
