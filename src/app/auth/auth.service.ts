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
            // Almacena el token en localStorage.
            const token = response['token'];
            localStorage.setItem('token', token);
          }
        })
      );
  }
}
