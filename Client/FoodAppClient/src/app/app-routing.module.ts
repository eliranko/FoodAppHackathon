import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './components/home/user-profile/user-profile.component';


const routes: Routes = [
  { path: '',
    redirectTo: '/profile',
    pathMatch: 'full'
  },
  { path: 'profile', component: UserProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
