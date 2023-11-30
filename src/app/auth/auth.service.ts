import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //private API_ASOPRACIR = "http://192.168.1.61/uqplatanos/";
  private API_ASOPRACIR = "http://192.168.217.37/uqplatanos/";

  constructor(private http: HttpClient) { }

  public login(docNumber: number, Password: any): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}login.php?docNumber=${docNumber}&Password=${Password}`)
      .pipe(
        tap((response:any) => {
          if (response['state'] === 'Ok') {
            // Almacena el token en localStorage.
            const token = response['token'];
            localStorage.setItem('token', token);
          }
        })
      );
  }
}