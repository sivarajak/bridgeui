import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { NgChatModule } from 'ng-chat';

import { RestApiService, DataService, AuthGuardService, UserService, AlertService, ScheduleService } from './services';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AlertComponent } from './components/alert/alert.component';
import { HomeComponent } from './components/home/home.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { PostreqComponent } from './components/postreq/postreq.component';
import { RequestsComponent } from './components/requests/requests.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { AvailabilitiesComponent } from './components/availabilities/availabilities.component';
import { MessagesComponent } from './components/messages/messages.component';
import { SettingsComponent } from './components/settings/settings.component';
import { JwtInterceptor, ErrorInterceptor, AppRouteReuseStrategy } from './helpers';
import { TreeviewModule } from 'ngx-treeview';
// used to create fake backend
import { fakeBackendProvider } from './helpers/fake-backend';
import { ChatComponent } from './components/chat/chat.component';
import { RouteReuseStrategy } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    ProfileComponent,
    HeaderComponent,
    FooterComponent,
    AlertComponent,
    HomeComponent,
    SubscribeComponent,
    ScheduleComponent,
    PostreqComponent,
    RequestsComponent,
    SubscriptionsComponent,
    AvailabilitiesComponent,
    MessagesComponent,
    SettingsComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    //BrowserAnimationsModule
    TreeviewModule.forRoot(),
    NgChatModule
  ],
  providers: [RestApiService, 
    DataService, 
    AuthGuardService, 
    UserService,
    AlertService,
    ScheduleService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy },
    DecimalPipe,
    //
    fakeBackendProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
