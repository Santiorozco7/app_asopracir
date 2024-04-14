import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { 
    path: 'agricultor', 
    canActivate: [AuthGuard], 
    loadChildren: () => import('./agricultor/agricultor.module').then(m => m.AgricultorModule),
    data: { roles: ['isFarmer'] } // Rol necesario para acceder a esta ruta
  },
  { 
    path: 'asociacion', 
    canActivate: [AuthGuard], 
    loadChildren: () => import('./asociacion/asociacion.module').then(m => m.AsociacionModule),
    data: { roles: ['isAdmin'] } // Rol necesario para acceder a esta ruta
  },
  { 
    path: 'colaborador', 
    canActivate: [AuthGuard], 
    loadChildren: () => import('./colaborador/colaborador.module').then(m => m.ColaboradorModule),
    data: { roles: ['isCollab'] } // Rol necesario para acceder a esta ruta
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
