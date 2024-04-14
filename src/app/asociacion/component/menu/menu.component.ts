import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  constructor(private authService: AuthService, private router: Router) { }

  logout(): void {
    // Llamar al método logout del servicio de autenticación al hacer clic en "Cerrar sesión".
    this.authService.logout();
    // Redirigir al componente de inicio de sesión.
    this.router.navigate(['/']);
  }
}
