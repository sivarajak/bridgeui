import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Subscription, Category } from '@app/models';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(
    private http: HttpClient,
    private userService: UserService) {
     }

  subscribe(subscription: Subscription, selectedCategories: number[]) {
    subscription.userId = this.userService.userValue.userId;
    subscription.selectedCategories = selectedCategories;
    console.log("subscription: " + subscription.location);
    console.log("subscription:selectedCategories  " + subscription.selectedCategories);
    console.log("SUbscription " + JSON.stringify(subscription))
    return this.http.post(`${environment.apiUrl}/api/subscriptions`, subscription);
  }

  /**getSubscriptionById(userId: number) {
    console.log("userId: " + userId);
    return this.http.get<Subscription>(`${environment.apiUrl}/api/subscriptions/${userId}`)
      .toPromise().catch((err: HttpErrorResponse) => {
      // simple logging, but you can do a lot more, see below
      console.error('An error occurred:', err.error);
      return null;
    });
  }*/

  getSubscriptionById(userId: number) {
    console.log("userId: " + userId);
    return this.http.get<Subscription>(`${environment.apiUrl}/api/subscriptions/${userId}`);
  }

  /**getAllSubscriptions() {
    return this.http.get<Subscription[]>(`${environment.apiUrl}/api/subscriptions`)
      .toPromise().catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        //console.error('An error occurred:', err.error);
        return null;
      });
  }*/

  getAllSubscriptions() {
    return this.http.get<Subscription[]>(`${environment.apiUrl}/api/subscriptions`);
  }

  updateSubscription(id, subscription, selectedCategories: number[]) {
    console.log("subscription: " + subscription);
    subscription.userId = id;
    subscription.selectedCategories = selectedCategories;
      return this.http.put(`${environment.apiUrl}/api/subscriptions/${id}`, subscription);
  }

  deleteSubscription(id: number) {
      return this.http.delete(`${environment.apiUrl}/api/subscriptions/${id}`);
          /**.pipe(map(x => {
              return x;
          })); */
  }
}
