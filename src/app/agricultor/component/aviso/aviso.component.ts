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
  @Input() cinta: any[] = [];
  // cintaProxima:any[] = this.cinta[1];
  expirationDate: Date | undefined;

  ngOnChanges() {
    if (this.cinta.length > 0) {
      this.expirationDate = new Date(this.cinta[0]?.endDate);
    } else {
      this.expirationDate = undefined;
    }
  }

  getDaysRemaining(): number | undefined {
    if (this.expirationDate) {
      const today = new Date();
      const timeDiff = this.expirationDate.getTime() - today.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    return undefined;
  }

}
