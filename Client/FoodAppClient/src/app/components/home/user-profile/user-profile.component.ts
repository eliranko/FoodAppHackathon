import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/GlobalServices/http.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  age: number;
  gender: string;
  height: number;
  weight: number;
  rmr: number;
  constructor(private http:HttpService) { }

  ngOnInit() {
    this.gender = "male";
  }

  calcRmr() {
    switch(this.gender) { 
      case "male": { 
        this.rmr = 66.5 + (13.75 * this.weight) + (5.003 * this.height) - (6.775 * this.age);
         break;
      } 
      case "female": { 
         this.rmr = 655.1 + (9.563 * this.weight) + (1.850 * this.height) - (4.676 * this.age);          
      } 
   } 
   this.http.UpdateRmr(this.rmr,this.weight).then(t =>{
    this.http.toggle();
   });
   
  }

}
