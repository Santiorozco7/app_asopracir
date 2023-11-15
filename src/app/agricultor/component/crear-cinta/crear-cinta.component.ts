import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  constructor(private formBuilder: FormBuilder, private service: AgricultorService, private router: Router) {
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
  
      // Aquí puedes enviar los datos al servidor (usando HttpClient, por ejemplo) para crear el nuevo lote.
      // También puedes agregar lógica de manejo de errores y respuestas del servidor.
    }
    this.cerrarCrearcinta.emit();
  }
}
