import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColaboradorRoutingModule } from './colaborador-routing.module';
import { ColaboradorLayoutComponent } from './colaborador-layout/colaborador-layout.component';
import { RoutesComponent } from './page/routes/routes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderFormComponent } from './component/order-form/order-form.component';
import { NotificationModule } from '../notification/notification.module';

@NgModule({
  declarations: [
    ColaboradorLayoutComponent,
    RoutesComponent,
    OrderFormComponent
  ],
  imports: [
    CommonModule,
    ColaboradorRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NotificationModule
  ]
})
export class ColaboradorModule { }
