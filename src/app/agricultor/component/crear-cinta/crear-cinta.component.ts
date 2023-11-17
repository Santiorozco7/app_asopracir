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
  @Input() crearCintaVisible: boolean = false;
  @Output() cintaCreada = new EventEmitter<void>();
  @Output() cerrarCrearcinta = new EventEmitter<void>();
  @Input() lote: any[] = [];

  constructor(private formBuilder: FormBuilder, private service: AgricultorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
  }

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
  
      console.log(formData);
  
      // Utiliza colorWithoutHash en tu solicitud al servidor
      this.service.crearCinta(batchID, numBunches, variety, colorWithoutHash).subscribe(cintacreado => {
        if (cintacreado['state'] === 'Ok') {
          console.log(cintacreado['state']);
          // this.router.navigate(['/agricultor']);
          // this.cerrarCrearcinta.emit();
          this.cintaCreada.emit(); // Envia el evento al componente de Lotes
        }
      });
    }
    this.cerrarCrearcinta.emit();
  }

  @HostListener('wheel', ['$event'])
  @HostListener('touchmove', ['$event'])
  onScroll(event: Event): void {
    // Verifica si el modal está visible y se está haciendo scroll
    if (this.crearCintaVisible) {
      this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
      setTimeout(() => {
        this.cerrarCrearcinta.emit();
        this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
      }, 200);
    }
  }
  
  cerrarDialogo(event: Event): void {
    // Verifica si el clic se realizó fuera del contenido del modal
    if (event.target === event.currentTarget) {
      this.cerrarCrearcinta.emit();
      this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
    }
  }
}
