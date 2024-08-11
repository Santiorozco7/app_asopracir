import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  private API_ASOPRACIR = "https://asopracir.com.co/app/";
  // private API_ASOPRACIR = "http://localhost/uqplatanos/";
  // private API_ASOPRACIR = "https://ingelectuq.net/uqasopracir/";

  constructor(private http: HttpClient) { }

  private addTimestamp(url: string): string {
    const timestamp = new Date().getTime();
    return `${url}&timestamp=${timestamp}`;
  }

  public getRoutes(filter?:string, fromdate?:string, todate?:string, limit?:string, offset?:string): Observable<any> {
    const token = localStorage.getItem('token');

    let url = `${this.API_ASOPRACIR}assoc.php?do=getRoutes`;

    if (filter) {
      url += `&filter=${filter}`;
    }
    if (fromdate) {
      url += `&fromdate=${fromdate}`;
    }
    if (todate) {
      url += `&todate=${todate}`;
    }
    if (limit) {
      url += `&limit=${limit}`;
    }
    if (offset) {
      url += `&offset=${offset}`;
    }

    url += `&token=${token}`;

    url = this.addTimestamp(url);

    return this.http.get(url);
  }

  public cancelRoute(routeID: string): Observable<any> {
    const url = `${this.API_ASOPRACIR}assoc.php?do=cancelRoute&token=${localStorage.getItem('token')}&routeID=${routeID}`;
    return this.http.get(this.addTimestamp(url));
  }

  public startRoute(routeID: string): Observable<any> {
    const url = `${this.API_ASOPRACIR}assoc.php?do=startRoute&token=${localStorage.getItem('token')}&routeID=${routeID}`;
    return this.http.get(this.addTimestamp(url));
  }

  public getRoute(routeID?: string): Observable<any> {
    const url = `${this.API_ASOPRACIR}assoc.php?do=getRoute&token=${localStorage.getItem('token')}&routeID=${routeID}`;
    return this.http.get(this.addTimestamp(url));
  }

  public getOrder(orderID: string): Observable<any> {
    const url = `${this.API_ASOPRACIR}assoc.php?do=getOrder&token=${localStorage.getItem('token')}&orderID=${orderID}`;
    return this.http.get(this.addTimestamp(url));
  }

  public getPrice(): Observable<any> {
    const url = `${this.API_ASOPRACIR}assoc.php?do=getPrice&token=${localStorage.getItem('token')}`;
    return this.http.get(this.addTimestamp(url));
  }

  public purgeRoute(routeID: string): Observable<any> {
    const url = `${this.API_ASOPRACIR}assoc.php?do=purgeRoute&token=${localStorage.getItem('token')}&routeID=${routeID}`;
    return this.http.get(this.addTimestamp(url));
  }

  public updateOrder(
    orderID:string, 
    weight1?:string, 
    weight2?:string, 
    weight3?:string,
    numBunches1?:string, 
    numBunches2?:string,
    numBunches3?:string,
    payAmount?:string, 
    payDate?:string, 
    signedBy?:string, 
    state?:string
    ): Observable<any> {
    const token = localStorage.getItem('token');

    let url = `${this.API_ASOPRACIR}assoc.php?do=updateOrder&orderID=${orderID}`;

    if (weight1) {
      url += `&weight1=${weight1}`;
    }
    if (weight2) {
      url += `&weight2=${weight2}`;
    }
    if (weight3) {
      url += `&weight3=${weight3}`;
    }
    if (numBunches1) {
      url += `&numBunches1=${numBunches1}`;
    }
    if (numBunches2) {
      url += `&numBunches2=${numBunches2}`;
    }
    if (numBunches3) {
      url += `&numBunches3=${numBunches3}`;
    }
    if (payAmount) {
      url += `&payAmount=${payAmount}`;
    }
    if (payDate) {
      url += `&payDate=${payDate}`;
    }
    if (signedBy) {
      url += `&signedBy=${signedBy}`;
    }
    if (state) {
      url += `&state=${state}`;
    }
    
    url += `&token=${token}`;

    return this.http.get(url);
  }

  public updateRoute(
    routeID: string,
    pickupDate?: string,
    startWeight?: string,
    endWeight?: string,
    state?: string,
    transID?: string,
    vehID?: string,
    collabID?: string
  ): Observable<any> {
    const token = localStorage.getItem('token');

    let url = `${this.API_ASOPRACIR}assoc.php?do=updateRoute&routeID=${routeID}`;

    if (pickupDate) {
      url += `&pickupDate=${pickupDate}`;
    }
    if (startWeight) {
      url += `&startWeight=${startWeight}`;
    }
    if (endWeight) {
      url += `&endWeight=${endWeight}`;
    }
    if (state) {
      url += `&state=${state}`;
    }
    if (transID) {
      url += `&transID=${transID}`;
    }
    if (vehID) {
      url += `&vehID=${vehID}`;
    }
    if (collabID) {
      url += `&collabID=${collabID}`;
    }

    url += `&token=${token}`;

    return this.http.get(url);
  }
}
