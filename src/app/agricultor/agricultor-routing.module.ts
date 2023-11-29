import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LotesComponent } from './page/lotes/lotes.component';
import { HistorialComponent } from './page/historial/historial.component';
import { AgricultorLayoutComponent } from './agricultor-layout/agricultor-layout.component';
import { OrdenesComponent } from './page/ordenes/ordenes.component';

const routes: Routes = [
  {
    path: '',
    component: AgricultorLayoutComponent,
    children: [
      { path: '', redirectTo: 'lotes', pathMatch: 'full', data: { title: 'Lotes' } },
      { path: 'lotes', component: LotesComponent, data: { title: 'Lotes' } },
      { path: 'ordenes', component: OrdenesComponent, data: { title: 'Órdenes' } },
      { path: 'historial', component: HistorialComponent, data: { title: 'Historial' } },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgricultorRoutingModule { }
