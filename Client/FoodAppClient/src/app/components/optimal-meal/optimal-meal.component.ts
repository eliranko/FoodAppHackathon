import { Component, OnInit } from '@angular/core';
import { OptimalMeal } from 'src/app/models/OptimalMeal';
import { HttpService } from 'src/app/GlobalServices/http.service';

@Component({
  selector: 'app-optimal-meal',
  templateUrl: './optimal-meal.component.html',
  styleUrls: ['./optimal-meal.component.scss']
})
export class OptimalMealComponent implements OnInit {
  optimalDish:OptimalMeal = new OptimalMeal();
  displayedColumns: string[] = ['name', 'amount'];
  constructor(private http:HttpService) { }

  ngOnInit() {
    this.GetOptiomalService();
    this.http.change.subscribe(data => {
      this.GetOptiomalService();
    });
    
  }

  GetOptiomalService() {
    this.http.GetOptimalMeal().then(data => {
      console.log(data);
      this.optimalDish = data;
      this.optimalDish.calories = Math.floor(this.optimalDish.calories);
      this.optimalDish.consumable.forEach(element => {
        element.value = Math.floor(element.value);
      });

    }).catch(err=>{
      console.log(err);
    });
  }
}
