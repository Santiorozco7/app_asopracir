import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AgricultorService {

  // private API_ASOPRACIR = "http://localhost/uqplatanos/";
  private API_ASOPRACIR = "https://ingelectuq.net/uqasopracir/";

  constructor(private http: HttpClient) { }

  private addTimestamp(url: string): string {
    const timestamp = new Date().getTime();
    return `${url}&timestamp=${timestamp}`;
  }

  public getTapes(): Observable<any> {
    const url = this.addTimestamp(`${this.API_ASOPRACIR}farmer.php?do=getTapes&token=${localStorage.getItem('token')}&filter=growing`);
    return this.http.get(url);
  }
  
  // public getTapes(): Observable<any> {
  //   return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=getTapes&token=${localStorage.getItem('token')}&filter=growing`);
  // }
  
  public createBatch(batchName:string, responsible:string, mainVariety:string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=createBatch&token=${localStorage.getItem('token')}&batchName=${batchName}&responsible=${responsible}&mainVariety=${mainVariety}`);
  }

  public updateBatch(batchID:string, batchName:string, responsible:string, mainVariety:string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=updateBatch&token=${localStorage.getItem('token')}&batchID=${batchID}&batchName=${batchName}&responsible=${responsible}&mainVariety=${mainVariety}`);
  }

  public getBatches(): Observable<any> {
    const url = this.addTimestamp(`${this.API_ASOPRACIR}farmer.php?do=getBatches&token=${localStorage.getItem('token')}`);
    return this.http.get(url);
  }

  // public getBatches(): Observable<any> {
  //   return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=getBatches&token=${localStorage.getItem('token')}`);
  // }

  public removeBatch(batchID:string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=removeBatch&token=${localStorage.getItem('token')}&batchID=${batchID}`);
  }

  public createTape(batchID:number, numBunches:number, variety:string, color:any): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=createTape&token=${localStorage.getItem('token')}&batchID=${batchID}&numBunches=${numBunches}&variety=${variety}&color=%23${color}`);
  }

  public updateTape(tapeID:string, numBunches:number, variety:string, color:any): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=updateTape&token=${localStorage.getItem('token')}&tapeID=${tapeID}&numBunches=${numBunches}&variety=${variety}&color=%23${color}`);
  } 

  /* public getTape(tapeID:string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=getTape&token=${localStorage.getItem('token')}&tapeID=${tapeID}`);
  } */

  /* public removeTape(batchID:number, numBunches:number, variety:string, color:any): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=removeTape&token=${localStorage.getItem('token')}&batchID=${batchID}&numBunches=${numBunches}&variety=${variety}&color=%23${color}`);
  } */

  public getOrders(): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=getOrders&token=${localStorage.getItem('token')}`);
  }

  public getOrder(orderID:string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=getOrder&token=${localStorage.getItem('token')}&orderID=${orderID}`);
  }

  public createOrder(tapeID:string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=createOrder&token=${localStorage.getItem('token')}&tapeID=${tapeID}`);
  }

  /* public addTapeToOrder(batchID:number, numBunches:number, variety:string, color:any): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=addTapeToOrder&token=${localStorage.getItem('token')}&batchID=${batchID}&numBunches=${numBunches}&variety=${variety}&color=%23${color}`);
  } */

  /* public removeTapeFromOrder(batchID:number, numBunches:number, variety:string, color:any): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=removeTapeFromOrder&token=${localStorage.getItem('token')}&batchID=${batchID}&numBunches=${numBunches}&variety=${variety}&color=%23${color}`);
  } */

  /* public removeOrder(batchID:number, numBunches:number, variety:string, color:any): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=removeOrder&token=${localStorage.getItem('token')}&batchID=${batchID}&numBunches=${numBunches}&variety=${variety}&color=%23${color}`);
  } */

  public getStats(): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}farmer.php?do=getStats&token=${localStorage.getItem('token')}`);
  }
}
