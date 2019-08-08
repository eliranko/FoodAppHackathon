import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/GlobalServices/http.service';
import { MenuItem } from 'src/app/models/menuItem';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  menu:MenuItem[] =[];
  displayedColumns: string[] = ['name', 'protein','fat','carbs','calories'];
  constructor(private http:HttpService) { }

  ngOnInit() {
    this.http.GetMenu().then(menu => {
      this.menu = menu;
    }).catch(err => {
      console.log(err);
    });
  }

}
