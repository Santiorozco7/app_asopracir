import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    // Verifica si el usuario está autenticado (El token existe en localStorage).
    const token = localStorage.getItem('token');
    if (token) {
      // El usuario está autenticado, permite el acceso.
      return true;
    } else {
      // El usuario no está autenticado, redirige a la página de inicio de sesión.
      this.router.navigate(['/']);
      return false;
    }
  }
}
