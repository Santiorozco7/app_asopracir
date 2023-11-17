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
  @Input() crearLoteVisible: boolean = false;
  @Output() loteCreado = new EventEmitter<void>();
  @Output() cerrarCrearlote = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private service: AgricultorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
  }

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
      console.log(formData.batchName);
      this.service.crearLote(batchName, responsible, mainVariety).subscribe(lotecreado => {
        if(lotecreado['state'] === 'Ok') {
          console.log(lotecreado['state']);
          // this.router.navigate(['/agricultor']);
          this.loteCreado.emit();
        }
      });
    }
    this.cerrarCrearlote.emit();
  }

  @HostListener('wheel', ['$event'])
  @HostListener('touchmove', ['$event'])
  onScroll(event: Event): void {
    // Verifica si el modal está visible y se está haciendo scroll
    if (this.crearLoteVisible) {
      this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
      setTimeout(() => {
        this.cerrarCrearlote.emit();
        this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
      }, 200);
    }
  }
  
  cerrarDialogo(event: Event): void {
    // Verifica si el clic se realizó fuera del contenido del modal
    if (event.target === event.currentTarget) {
      this.cerrarCrearlote.emit();
      this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open');
    }
  }
}
