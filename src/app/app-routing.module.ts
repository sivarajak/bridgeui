import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { AvailabilitiesComponent } from './components/availabilities/availabilities.component';
import { PostreqComponent } from './components/postreq/postreq.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { RequestsComponent } from './components/requests/requests.component';
import { MessagesComponent } from './components/messages/messages.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';



import { AuthGuardService } from './services';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    //canActivate: [AuthGuardService],
  },{
    path: 'register',
    component: RegistrationComponent,
    //canActivate: [AuthGuardService],
  },
  {
    path: 'login',
    component: LoginComponent,
    //canActivate: [AuthGuardService],
  },
  {
    path: 'users/:userId',
    component: ProfileComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'postrequest',
    component: PostreqComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'subscriberequest',
    component: SubscribeComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'scheduleavailability',
    component: ScheduleComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'searchavailabilities',
    component: AvailabilitiesComponent,
    //canActivate: [AuthGuardService],
  },
  {
    path: 'posts',
    component: RequestsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'subscribedrequests',
    component: SubscriptionsComponent,
    canActivate: [AuthGuardService],
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
