import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AsociacionService {
  private API_ASOPRACIR = "http://localhost/uqplatanos/";
  // private API_ASOPRACIR = "https://ingelectuq.net/uqasopracir/";
  // private API_ASOPRACIR = "http://192.168.102.191/uqplatanos/";

  constructor(private http: HttpClient) { }

  private addTimestamp(url: string): string {
    const timestamp = new Date().getTime();
    return `${url}&timestamp=${timestamp}`;
  }

  public getFarms(
    filter?: string,
    limit?: string,
    offset?: string,
  ): Observable<any> {
    const token = localStorage.getItem('token');

    let url = `${this.API_ASOPRACIR}assoc.php?do=getFarms`;

    if (filter) {
      url += `&filter=${filter}`;
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

  public getTransporters(filter: string): Observable<any> {
  const url = `${this.API_ASOPRACIR}assoc.php?do=getTransporters&token=${localStorage.getItem('token')}&filter=${filter}`;
  return this.http.get(this.addTimestamp(url));
  }

  public getCollaborators(): Observable<any> {
    const url = `${this.API_ASOPRACIR}assoc.php?do=getCollaborators&token=${localStorage.getItem('token')}`;
    return this.http.get(this.addTimestamp(url));
  }

  public getPendingOrders(): Observable<any> {
    const url = `${this.API_ASOPRACIR}assoc.php?do=getPendingOrders&token=${localStorage.getItem('token')}`;
    return this.http.get(this.addTimestamp(url));
  }

  public getPendingTapes(months: number): Observable<any> {
    const url = `${this.API_ASOPRACIR}assoc.php?do=getPendingTapes&token=${localStorage.getItem('token')}&months=${months}`;
    return this.http.get(this.addTimestamp(url));
  }

  public getOrders(filter: number): Observable<any> {
    const url = `${this.API_ASOPRACIR}assoc.php?do=getOrders&token=${localStorage.getItem('token')}&filter=${filter}`;
    return this.http.get(this.addTimestamp(url));
  }

  public getOrder(orderID: number): Observable<any> {
    const url = `${this.API_ASOPRACIR}assoc.php?do=getOrder&token=${localStorage.getItem('token')}&orderID=${orderID}`;
    return this.http.get(this.addTimestamp(url));
  }

  public getRoutes(filter?:number, limit?:string, offset?:string): Observable<any> {
    const token = localStorage.getItem('token');

    let url = `${this.API_ASOPRACIR}assoc.php?do=getRoutes`;

    if (filter) {
      url += `&filter=${filter}`;
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

  public getRoute(routeID?: number): Observable<any> {
    const url = `${this.API_ASOPRACIR}assoc.php?do=getRoute&token=${localStorage.getItem('token')}&routeID=${routeID}`;
    return this.http.get(this.addTimestamp(url));
  }
  
  public getFarmer(docType: string, docNumber: string): Observable<any> {
    const url = `${this.API_ASOPRACIR}assoc.php?do=getFarmer&token=${localStorage.getItem('token')}&docType=${docType}&docNumber=${docNumber}`;
    return this.http.get(this.addTimestamp(url));
  }
  
  public getUser(docType: string, docNumber: string): Observable<any> {
    const url = `${this.API_ASOPRACIR}assoc.php?do=getUser&token=${localStorage.getItem('token')}&docType=${docType}&docNumber=${docNumber}`;
    return this.http.get(this.addTimestamp(url));
  }

  public getRoles(docType: string, docNumber: string): Observable<any> {
    const url = `${this.API_ASOPRACIR}assoc.php?do=getRoles&token=${localStorage.getItem('token')}&docType=${docType}&docNumber=${docNumber}`;
    return this.http.get(this.addTimestamp(url));
  }
  
  public getTransporter(docType: string, docNumber: string): Observable<any> {
    const url = `${this.API_ASOPRACIR}assoc.php?do=getTransporter&token=${localStorage.getItem('token')}&docType=${docType}&docNumber=${docNumber}`;
    return this.http.get(this.addTimestamp(url));
  }

  public createFarmer(userID: string, farmID: string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}assoc.php?do=createFarmer&token=${localStorage.getItem('token')}&userID=${userID}&farmID=${farmID}`);
  }

  public createOrder(farmID:number, tapeID:number): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}assoc.php?do=createOrder&token=${localStorage.getItem('token')}&farmID=${farmID}&tapeID=${tapeID}`);
  }

  public createRoute(transID?:number, vehID?:number, collabID?:number, pickupDate?:string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}assoc.php?do=createRoute&token=${localStorage.getItem('token')}&transID=${transID}&vehID=${vehID}&collabID=${collabID}&pickupDate=${pickupDate}`);
  }

  public createTransporter(userID:string, vehID:string, licenseType:string, licenseExpiration:string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}assoc.php?do=createTransporter&token=${localStorage.getItem('token')}&userID=${userID}&vehID=${vehID}&licenseType=${licenseType}&licenseExpiration=${licenseExpiration}`);
  }

  public createCollab(userID:string, roleName:string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}assoc.php?do=createCollab&token=${localStorage.getItem('token')}&userID=${userID}&roleName=${roleName}`);
  }

  public createUser(
    names: string,
    firstLastname: string,
    docType: string,
    docNumber: string,
    secondLastname?: string,
    docIssueDate?: string,
    docIssuePlace?: string,
    birthday?: string,
    address?: string,
    city?: string,
    phoneNumber?: string,
    altPhoneNumber?: string,
    email?: string,
    bankAccountBName?: string,
    bankAccountType?: string,
    bankAccountNumber?: string
  ): Observable<any> {
    const token = localStorage.getItem('token');

    let url = `${this.API_ASOPRACIR}assoc.php?do=createUser&names=${names}&firstLastname=${firstLastname}&docType=${docType}&docNumber=${docNumber}`;

    if (secondLastname) {
      url += `&secondLastname=${secondLastname}`;
    }
    if (docIssueDate) {
      url += `&docIssueDate=${docIssueDate}`;
    }
    if (docIssuePlace) {
      url += `&docIssuePlace=${docIssuePlace}`;
    }
    if (birthday) {
      url += `&birthday=${birthday}`;
    }
    if (address) {
      url += `&address=${address}`;
    }
    if (city) {
      url += `&city=${city}`;
    }
    if (phoneNumber) {
      url += `&phoneNumber=${phoneNumber}`;
    }
    if (altPhoneNumber) {
      url += `&altPhoneNumber=${altPhoneNumber}`;
    }
    if (email) {
      url += `&email=${email}`;
    }
    if (bankAccountBName) {
      url += `&bankAccountBName=${bankAccountBName}`;
    }
    if (bankAccountType) {
      url += `&bankAccountType=${bankAccountType}`;
    }
    if (bankAccountNumber) {
      url += `&bankAccountNumber=${bankAccountNumber}`;
    }

    url += `&token=${token}`;

    return this.http.get(url);
  }

  public createVehicle(
    plate: string,
    soatExpiration: string,
    techExpiration: string,
    type: string,
    capacity: string,
    comments: string,
  ): Observable<any> {
    const token = localStorage.getItem('token');

    let url = `${this.API_ASOPRACIR}assoc.php?do=createVehicle`;

    if (plate) {
      url += `&plate=${plate}`;
    }
    if (soatExpiration) {
      url += `&soatExpiration=${soatExpiration}`;
    }
    if (techExpiration) {
      url += `&techExpiration=${techExpiration}`;
    }
    if (type) {
      url += `&type=${type}`;
    }
    if (capacity) {
      url += `&capacity=${capacity}`;
    }
    if (comments) {
      url += `&comments=${comments}`;
    }

    url += `&token=${token}`;

    return this.http.get(url);
  }

  public createFarm(
    farmName: string,
    zoneName: string,
    city: string,
    area?: string,
    GPSposition?: string
  ): Observable<any> {
    const token = localStorage.getItem('token');

    let url = `${this.API_ASOPRACIR}assoc.php?do=createFarm`;

    if (farmName) {
      url += `&farmName=${farmName}`;
    }
    if (zoneName) {
      url += `&zoneName=${zoneName}`;
    }
    if (city) {
      url += `&city=${city}`;
    }
    if (area) {
      url += `&area=${area}`;
    }
    if (GPSposition) {
      url += `&secondLastname=${GPSposition}`;
    }

    url += `&token=${token}`;

    return this.http.get(url);
  }

  public updateVehicle(
    vehID: string,
    plate: string,
    soatExpiration: string,
    techExpiration: string,
    type: string,
    capacity: string,
    comments: string,
    state:string
  ): Observable<any> {
    const token = localStorage.getItem('token');

    let url = `${this.API_ASOPRACIR}assoc.php?do=updateVehicle&vehID=${vehID}`;

    if (plate) {
      url += `&plate=${plate}`;
    }
    if (soatExpiration) {
      url += `&soatExpiration=${soatExpiration}`;
    }
    if (techExpiration) {
      url += `&techExpiration=${techExpiration}`;
    }
    if (type) {
      url += `&type=${type}`;
    }
    if (capacity) {
      url += `&capacity=${capacity}`;
    }
    if (comments) {
      url += `&comments=${comments}`;
    }
    if (state) {
      url += `&state=${state}`;
    }

    url += `&token=${token}`;

    return this.http.get(url);
  }

  public updateUser(
    userID: string,
    names: string,
    firstLastname: string,
    docType: string,
    docNumber: string,
    secondLastname?: string,
    docIssueDate?: string,
    docIssuePlace?: string,
    birthday?: string,
    address?: string,
    city?: string,
    phoneNumber?: string,
    altPhoneNumber?: string,
    email?: string,
    bankAccountBName?: string,
    bankAccountType?: string,
    bankAccountNumber?: string
  ): Observable<any> {
    const token = localStorage.getItem('token');

    let url = `${this.API_ASOPRACIR}assoc.php?do=updateUser&userID=${userID}`;

    if (names) {
      url += `&names=${names}`;
    }
    if (firstLastname) {
      url += `&firstLastname=${firstLastname}`;
    }
    if (docType) {
      url += `&docType=${docType}`;
    }
    if (docNumber) {
      url += `&docNumber=${docNumber}`;
    }
    if (secondLastname) {
      url += `&secondLastname=${secondLastname}`;
    }
    if (docIssueDate) {
      url += `&docIssueDate=${docIssueDate}`;
    }
    if (docIssuePlace) {
      url += `&docIssuePlace=${docIssuePlace}`;
    }
    if (birthday) {
      url += `&birthday=${birthday}`;
    }
    if (address) {
      url += `&address=${address}`;
    }
    if (city) {
      url += `&city=${city}`;
    }
    if (phoneNumber) {
      url += `&phoneNumber=${phoneNumber}`;
    }
    if (altPhoneNumber) {
      url += `&altPhoneNumber=${altPhoneNumber}`;
    }
    if (email) {
      url += `&email=${email}`;
    }
    if (bankAccountBName) {
      url += `&bankAccountBName=${bankAccountBName}`;
    }
    if (bankAccountType) {
      url += `&bankAccountType=${bankAccountType}`;
    }
    if (bankAccountNumber) {
      url += `&bankAccountNumber=${bankAccountNumber}`;
    }

    url += `&token=${token}`;

    return this.http.get(url);
  }

  public updateFarm(
    farmID: string,
    farmName: string,
    zoneName: string,
    city: string,
    area: string,
    GPSposition?: string
  ): Observable<any> {
    const token = localStorage.getItem('token');

    let url = `${this.API_ASOPRACIR}assoc.php?do=updateFarm&farmID=${farmID}`;

    if (farmName) {
      url += `&farmName=${farmName}`;
    }
    if (zoneName) {
      url += `&zoneName=${zoneName}`;
    }
    if (city) {
      url += `&city=${city}`;
    }
    if (area) {
      url += `&area=${area}`;
    }
    if (GPSposition) {
      url += `&secondLastname=${GPSposition}`;
    }

    url += `&token=${token}`;

    return this.http.get(url);
  }

  public updateRoute(
    routeID: number,
    pickupDate?: string,
    startWeight?: string,
    endWeight?: string,
    state?: string,
    transID?: number,
    vehID?: number,
    collabID?: number
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

  public updateTransporter(transID:string, licenseType:string, licenseExpiration:string, comments:string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}assoc.php?do=updateTransporter&token=${localStorage.getItem('token')}&transID=${transID}&licenseType=${licenseType}&licenseExpiration=${licenseExpiration}&comments=${comments}`);
  }

  public appendOrderToRoute(routeID:number, orderID:number): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}assoc.php?do=appendOrderToRoute&token=${localStorage.getItem('token')}&routeID=${routeID}&orderID=${orderID}`);
  }

  public removeOrderFromRoute(orderID:number): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}assoc.php?do=removeOrderFromRoute&token=${localStorage.getItem('token')}&orderID=${orderID}`);
  }

  public cancelRoute(routeID:number): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}assoc.php?do=cancelRoute&token=${localStorage.getItem('token')}&routeID=${routeID}`);
  }

  public setFarmerStatus(farmerID:number, state:string): Observable<any> {
    return this.http.get(`${this.API_ASOPRACIR}assoc.php?do=setFarmerStatus&token=${localStorage.getItem('token')}&farmerID=${farmerID}&state=${state}`);
  }

  public getStats(filter?:string): Observable<any> {
    const token = localStorage.getItem('token');

    let url = `${this.API_ASOPRACIR}assoc.php?do=getStats`;

    if (filter) {
      url += `&filter=${filter}`;
    }

    url += `&token=${token}`;

    url = this.addTimestamp(url);

    return this.http.get(url);
  }
}
