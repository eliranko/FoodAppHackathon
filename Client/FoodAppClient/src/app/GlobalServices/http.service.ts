import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OptimalMeal } from '../models/OptimalMeal';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private serverUrl = "http://132.74.210.70:8080";
  constructor(private http:HttpClient) { }

  public UpdateRmr(rmr:number){
    let Body = {rmr:rmr};
    return this.http.put(this.serverUrl + "/api/rmr",Body).toPromise();
  }
  public GetMenu() :Promise<string[]>{
    return this.http.get<string[]>(this.serverUrl + "/api/food").toPromise();
  }
  public GetOptimalMeal() :Promise<OptimalMeal>{
    return this.http.get<OptimalMeal>(this.serverUrl + "/optimal").toPromise();
  }
}
