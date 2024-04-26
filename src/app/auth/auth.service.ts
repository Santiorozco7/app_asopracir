import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_ASOPRACIR = "http://localhost/uqplatanos/";
  // private API_ASOPRACIR = "https://ingelectuq.net/uqasopracir/";

  constructor(private http: HttpClient) { }

  private addTimestamp(url: string): string {
    const timestamp = new Date().getTime();
    return `${url}&timestamp=${timestamp}`;
  }

  public login(docType: string, docNumber: string, Password: string, role?: string): Observable<any> {
    let loginUrl = `${this.API_ASOPRACIR}login.php?docNumber=${docNumber}&docType=${docType}&Password=${Password}`;
    if (role) {
      loginUrl += `&role=${role}`;
    }
    const urlWithTimestamp = this.addTimestamp(loginUrl);
    return this.http.get(urlWithTimestamp)
      .pipe(
        tap((response: any) => {
          if (response['state'] === 'Ok') {
            // Almacenar el token y el arreglo de roles en localStorage.
            const token = response['token'];
            const roles = response['roles'];
            localStorage.setItem('token', token);
            localStorage.setItem('roles', JSON.stringify(roles)); 
          }
        })
      );
  }

  isLoggedIn(): boolean {
    // Verificar si el token del usuario está presente en el localStorage.
    return !!localStorage.getItem('token');
  }

  public logout(): void {
    // Eliminar el token y los roles del almacenamiento local al cerrar sesión.
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
  }
  
  public getUserRoles(): any {
    // Obtener los roles del usuario desde localStorage.
    const rolesString = localStorage.getItem('roles');
    if (rolesString) {
      return JSON.parse(rolesString);
    } else {
      return null;
    }
  }
}
