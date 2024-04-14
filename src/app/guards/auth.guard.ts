import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      // El usuario está autenticado, ahora verificamos los roles necesarios.
      const roles = this.authService.getUserRoles();
      if (roles) {
        // Verificar si el usuario tiene permiso para acceder a la ruta.
        const routeRoles = (next.data as { roles: string[] }).roles;
        if (routeRoles.every(role => roles[role])) {
          // El usuario tiene los roles necesarios, permitir el acceso.
          return true;
        }
      }
    }
    // El usuario no está autenticado o no tiene los roles necesarios, redirigir a la página de inicio de sesión.
    this.router.navigate(['/']);
    return false;
  }
}
