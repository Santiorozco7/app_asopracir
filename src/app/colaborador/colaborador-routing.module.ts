import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColaboradorLayoutComponent } from './colaborador-layout/colaborador-layout.component';
import { RoutesComponent } from './page/routes/routes.component';

const routes: Routes = [
  {
    path: '',
    component: ColaboradorLayoutComponent,
    children: [
      { path: '', redirectTo: 'rutas', pathMatch: 'full' },
      { path: 'rutas', component: RoutesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ColaboradorRoutingModule { }
