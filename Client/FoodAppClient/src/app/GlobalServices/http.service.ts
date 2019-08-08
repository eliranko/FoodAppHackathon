import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OptimalMeal } from '../models/OptimalMeal';
import { Subject } from 'rxjs';
import { MenuItem } from '../models/menuItem';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private serverUrl = "http://132.74.210.70:8080";
  @Output() change: EventEmitter<string> = new EventEmitter();

  constructor(private http:HttpClient) { }

  public UpdateRmr(rmr:number,weight:number){
    let Body = {rmr:rmr,weight:weight};
    return this.http.post(this.serverUrl + "/rmr",Body).toPromise();
  }
  public GetMenu() :Promise<MenuItem[]>{
    return this.http.get<MenuItem[]>(this.serverUrl + "/menu").toPromise();
  }
  public GetOptimalMeal() :Promise<OptimalMeal>{
    return this.http.get<OptimalMeal>(this.serverUrl + "/optimal").toPromise();
  }
  toggle() {
    this.change.emit("");
  }
}
