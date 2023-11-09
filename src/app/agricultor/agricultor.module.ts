import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgricultorRoutingModule } from './agricultor-routing.module';
import { HistorialComponent } from './page/historial/historial.component';
import { LotesComponent } from './page/lotes/lotes.component';
import { HeaderComponent } from './component/header/header.component';
import { MenuComponent } from './component/menu/menu.component';
import { AvisoComponent } from './component/aviso/aviso.component';
import { AgricultorLayoutComponent } from './agricultor-layout/agricultor-layout.component';
import { ModalLotesComponent } from './component/modal-lotes/modal-lotes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CrearLoteComponent } from './component/crear-lote/crear-lote.component';
import { CrearCintaComponent } from './component/crear-cinta/crear-cinta.component';
import { EditarEliminarLoteComponent } from './component/editar-eliminar-lote/editar-eliminar-lote.component';
import { OrdenesComponent } from './page/ordenes/ordenes.component';
import { ModalOrderComponent } from './component/modal-order/modal-order.component';
import { CreateOrderComponent } from './component/create-order/create-order.component';
import { ModalHistorialComponent } from './component/modal-historial/modal-historial.component';


@NgModule({
  declarations: [
    HistorialComponent,
    LotesComponent,
    HeaderComponent,
    MenuComponent,
    AvisoComponent,
    AgricultorLayoutComponent,
    ModalLotesComponent,
    CrearLoteComponent,
    CrearCintaComponent,
    EditarEliminarLoteComponent,
    OrdenesComponent,
    ModalOrderComponent,
    CreateOrderComponent,
    ModalHistorialComponent
  ],
  imports: [
    CommonModule,
    AgricultorRoutingModule,
    ReactiveFormsModule
  ]
})
export class AgricultorModule { }
