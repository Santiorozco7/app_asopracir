import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.component.html',
  styleUrls: ['./aviso.component.css']
})
export class AvisoComponent {
  @Input() tapes: any[] = [];
  @Input() batches: any[] = [];

  expirationDate: Date | undefined;
  daysRemaining: number | undefined;
  selectedTape: any | undefined;

  ngOnChanges() {
    this.findClosestTape();
    // Verifica si expirationDate es definido antes de llamar a la función
    if (this.expirationDate !== undefined) {
      this.daysRemaining = this.calculateDaysRemaining(this.expirationDate);
    } else {
      // Manejar el caso en que expirationDate sea undefined
      this.daysRemaining = undefined;
    }
  }
  
  private findClosestTape(): void {
    const activeTapes = this.getActiveTapes();

    if (activeTapes.length > 0) {
      this.selectedTape = this.findClosestTapeFromList(activeTapes);
      this.expirationDate = new Date(this.selectedTape.endDate);
    } else {
      this.expirationDate = undefined;
    }
  }

  private getActiveTapes(): any[] {
    return this.tapes.filter(tape => this.batches.some(batch => batch.batchID === tape.batchID));
  }

  private findClosestTapeFromList(tapeList: any[]): any {
    const today = new Date();
    let closestTape: any | null = null;

    tapeList.forEach(tape => {
      const currentEndDate = new Date(tape.endDate);

      if (closestTape === null || (currentEndDate >= today && currentEndDate < new Date(closestTape.endDate))) {
        closestTape = tape;
      }
    });

    return closestTape;
  }

  private calculateDaysRemaining(endDate: Date): number {
    const today = new Date();
    const timeDiff = endDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
}
