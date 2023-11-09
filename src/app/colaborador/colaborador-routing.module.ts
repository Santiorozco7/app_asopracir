import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColaboradorLayoutComponent } from './colaborador-layout/colaborador-layout.component';

const routes: Routes = [
  {
    path: '',
    component: ColaboradorLayoutComponent//,
    // children: [
    //   { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    //   { path: 'inicio', component: LotesComponent },
    //   { path: 'produccion', component: ProduccionComponent },
    //   { path: 'historial', component: HistorialComponent },
    // ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ColaboradorRoutingModule { }
