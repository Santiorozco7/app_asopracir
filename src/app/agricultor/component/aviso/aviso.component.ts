import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgricultorService } from '../../agricultor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.component.html',
  styleUrls: ['./aviso.component.css']
})
export class AvisoComponent {
  @Input() tapes: any[] = [];
  @Input() batches: any[] = [];

  expirationDate: Date | undefined;
  selectedTape: any | undefined;

  ngOnChanges() {
    // Filtra las cintas que pertenecen a lotes activos
    const activeTapes = this.tapes.filter(tape => this.batches.some(batch => batch.batchID === tape.batchID));

    // Encuentra la cinta más próxima
    if (activeTapes.length > 0) {
      this.selectedTape = activeTapes.reduce((closest, current) => {
        const closestDate = new Date(closest.endDate);
        const currentDate = new Date(current.endDate);

        return currentDate < closestDate ? current : closest;
      });

      this.expirationDate = new Date(this.selectedTape.endDate);
    } else {
      this.expirationDate = undefined;
    }
  }

  getDaysRemaining(): number | undefined {
    if (this.expirationDate) {
      const today = new Date();
      let timeDiff = this.expirationDate.getTime() - today.getTime();
      let daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // Verifica si el número de días restantes es un entero positivo
      if (daysRemaining < 0) {
        // Si la fecha de corte ya pasó, busca la siguiente cinta más próxima
        const activeTapes = this.tapes.filter(tape => this.batches.some(batch => batch.batchID === tape.batchID));
        if (activeTapes.length > 0) {
          this.selectedTape = activeTapes.reduce((closest, current) => {
            const currentEndDate = new Date(current.endDate);
            const currentDiff = currentEndDate.getTime() - today.getTime();

            if (currentDiff > 0 && (closest === null || currentDiff < closest)) {
              return current;
            }

            return closest;
          });

          this.expirationDate = new Date(this.selectedTape.endDate);

          // Actualiza los días restantes con la nueva cinta más próxima
          timeDiff = this.expirationDate.getTime() - today.getTime();
          daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
        }
      }

      return daysRemaining >= 0 ? daysRemaining : undefined;
    }

    return undefined;
  }
}
