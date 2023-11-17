import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColaboradorRoutingModule } from './colaborador-routing.module';
import { ColaboradorLayoutComponent } from './colaborador-layout/colaborador-layout.component';


@NgModule({
  declarations: [
    ColaboradorLayoutComponent
  ],
  imports: [
    CommonModule,
    ColaboradorRoutingModule
  ]
})
export class ColaboradorModule { }
