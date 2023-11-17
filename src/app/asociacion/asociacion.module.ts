import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsociacionRoutingModule } from './asociacion-routing.module';
import { AsociacionLayoutComponent } from './asociacion-layout/asociacion-layout.component';
import { FarmsComponent } from './page/farms/farms.component';
import { TransportComponent } from './page/transport/transport.component';
import { ProductionComponent } from './page/production/production.component';
import { MenuComponent } from './component/menu/menu.component';
import { OrdersComponent } from './page/orders/orders.component';
import { RegisterComponent } from './page/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalFarmComponent } from './component/modal-farm/modal-farm.component';
import { ModalTransportComponent } from './component/modal-transport/modal-transport.component';
import { CreateVehicleComponent } from './component/create-vehicle/create-vehicle.component';


@NgModule({
  declarations: [
    AsociacionLayoutComponent,
    FarmsComponent,
    TransportComponent,
    ProductionComponent,
    MenuComponent,
    OrdersComponent,
    RegisterComponent,
    ModalFarmComponent,
    ModalTransportComponent,
    CreateVehicleComponent
  ],
  imports: [
    CommonModule,
    AsociacionRoutingModule,
    ReactiveFormsModule
  ]
})
export class AsociacionModule { }
