import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColaboradorRoutingModule } from './colaborador-routing.module';
import { ColaboradorLayoutComponent } from './colaborador-layout/colaborador-layout.component';
import { RoutesComponent } from './page/routes/routes.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ColaboradorLayoutComponent,
    RoutesComponent
  ],
  imports: [
    CommonModule,
    ColaboradorRoutingModule,
    ReactiveFormsModule
  ]
})
export class ColaboradorModule { }
