import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AgricultorService {

  private API_ASOPRACIR = "http://192.168.1.61/uqplatanos/";
  // private API_ASOPRACIR = "http://192.168.217.37/uqplatanos/";

  constructor(private http: HttpClient) { }

  public lotes(): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=getBatches&token=${localStorage.getItem('token')}`);
  }

  public cinta(): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=getTapes&token=${localStorage.getItem('token')}&filter=growing`);
  }

  public crearLote(batchName:string, responsible:string, mainVariety:string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=createBatch&token=${localStorage.getItem('token')}&batchName=${batchName}&responsible=${responsible}&mainVariety=${mainVariety}`);
  }

  public crearCinta(batchID:number, numBunches:number, variety:string, color:any): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=createTape&token=${localStorage.getItem('token')}&batchID=${batchID}&numBunches=${numBunches}&variety=${variety}&color=%23${color}`);
  }

  public editarLote(batchID:string, batchName:string, responsible:string, mainVariety:string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=updateBatch&token=${localStorage.getItem('token')}&batchID=${batchID}&batchName=${batchName}&responsible=${responsible}&mainVariety=${mainVariety}`);
  }

  public eliminarLote(batchID:string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=removeBatch&token=${localStorage.getItem('token')}&batchID=${batchID}`);
  }

  public ordenes(): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=getOrders&token=${localStorage.getItem('token')}`);
  }

  public orden(orderID:string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=getOrder&token=${localStorage.getItem('token')}&orderID=${orderID}`);
  }

  public crearOrden(tapeID:string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=createOrder&token=${localStorage.getItem('token')}&tapeID=${tapeID}`);
  }

  public historial(): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=getStats&token=${localStorage.getItem('token')}`);
  }
}
