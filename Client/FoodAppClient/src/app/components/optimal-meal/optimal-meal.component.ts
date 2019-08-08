import { Component, OnInit } from '@angular/core';
import { OptimalMeal } from 'src/app/models/OptimalMeal';
import { HttpService } from 'src/app/GlobalServices/http.service';

@Component({
  selector: 'app-optimal-meal',
  templateUrl: './optimal-meal.component.html',
  styleUrls: ['./optimal-meal.component.scss']
})
export class OptimalMealComponent implements OnInit {
  optimalDish:OptimalMeal;
  constructor(private http:HttpService) { }

  ngOnInit() {
    this.http.GetOptimalMeal().then(data => {
      console.log(data);
    });
  }

}
