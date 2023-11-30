import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsociacionLayoutComponent } from './asociacion-layout/asociacion-layout.component';
import { FarmsComponent } from './page/farms/farms.component';
import { TransportComponent } from './page/transport/transport.component';
import { ProductionComponent } from './page/production/production.component';
import { OrdersComponent } from './page/orders/orders.component';
import { RegisterComponent } from './page/register/register.component';
import { RoutesComponent } from './page/routes/routes.component';

const routes: Routes = [
  {
    path: '',
    component: AsociacionLayoutComponent,
    children: [
      { path: '', redirectTo: 'fincas', pathMatch: 'full', data: { title: 'Fincas' } },
      { path: 'fincas', component: FarmsComponent, data: { title: 'Fincas' } },
      { path: 'transporte', component: TransportComponent, data: { title: 'Trasnporte' } },
      { path: 'produccion', component: ProductionComponent, data: { title: 'Producción' } },
      { path: 'ordenes', component: OrdersComponent, data: { title: 'Ordenes' } },
      { path: 'registrar', component: RegisterComponent, data: { title: 'Registro' } },
      { path: 'rutas', component: RoutesComponent, data: { title: 'Rutas' } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsociacionRoutingModule { }
