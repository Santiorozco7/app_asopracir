import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-colaborador-layout',
  templateUrl: './colaborador-layout.component.html',
  styleUrls: ['./colaborador-layout.component.css']
})
export class ColaboradorLayoutComponent {
  constructor(private authService: AuthService, private router: Router) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
