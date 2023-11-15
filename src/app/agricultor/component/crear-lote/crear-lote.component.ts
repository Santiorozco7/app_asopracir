import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  constructor(private formBuilder: FormBuilder, private service: AgricultorService, private router: Router) {
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
}
