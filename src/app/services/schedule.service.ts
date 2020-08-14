import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Availability } from '@app/models';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor( private router: Router,
    private http: HttpClient,
    private userService: UserService) {
    
  }

  scheduleAvailability(availability: Availability) {
    availability.userId = this.userService.userValue.userId;
    availability.userNickName = this.userService.userValue.name;
    console.log("availability1: " + availability.userId);
    console.log("availability2: " + availability.userNickName);
    console.log("availability3: " + availability.availableFor);
    /**console.log("availability2: " + availability.schedules[0]);
    console.log("availability3: " + availability.schedules[0].day);
    console.log("availability4: " + availability.schedules[0].startTime.hour);
    console.log("availability5: " + availability.schedules[0].startTime.minute);
    console.log("availability6: " + availability.schedules[0].startTime.second);
    console.log(environment.apiUrl);*/
    return this.http.post(`${environment.apiUrl}/api/availabilities`, availability);
  }

  /**getAvailabilityById(userId: number) {
    console.log("userId: " + userId);
    return this.http.get<Availability>(`${environment.apiUrl}/api/availabilities/${userId}`)
      .toPromise().catch((err: HttpErrorResponse) => {
      // simple logging, but you can do a lot more, see below
      //console.error('An error occurred:', err.error);
      return null;
    });
  }*/

  getAvailabilityById(userId: number) {
    console.log("userId: " + userId);
    return this.http.get<Availability>(`${environment.apiUrl}/api/availabilities/${userId}`);
     
  }

  /**getAllAvailabilities() {
    return this.http.get<Availability[]>(`${environment.apiUrl}/api/availabilities`)
      .toPromise().catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        //console.error('An error occurred:', err.error);
        return null;
      });
  }*/

  getAllAvailabilities() {
    return this.http.get<Availability[]>(`${environment.apiUrl}/api/availabilities`);
  }

  updateAvailability(userId, availability) {
    console.log("updateAvailability: " + availability);
    availability.userId = userId;
    availability.userNickName = this.userService.userValue.name;
      return this.http.put(`${environment.apiUrl}/api/availabilities/${userId}`, availability);
  }

  deleteAvailability(userId: number) {
      return this.http.delete(`${environment.apiUrl}/api/availabilities/${userId}`);
          /**.pipe(map(x => {
              return x;
          })); */
  }

}
