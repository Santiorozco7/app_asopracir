import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_ASOPRACIR = "https://ingelectuq.net/uqasopracir/";

  constructor(private http: HttpClient) { }

  private addTimestamp(url: string): string {
    const timestamp = new Date().getTime();
    return `${url}&timestamp=${timestamp}`;
  }

  public login(docNumber: number, Password: any): Observable<any> {
    const loginUrl = `${this.API_ASOPRACIR}login.php?docNumber=${docNumber}&Password=${Password}`;
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
