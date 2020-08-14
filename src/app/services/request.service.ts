import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Request, Category } from '@app/models';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    private http: HttpClient,
    private userService: UserService) {
     }

  postRequest(request: Request, selectedCategories: number[]) {
    request.userId = this.userService.userValue.userId;
    request.userNickName = this.userService.userValue.name;
    request.selectedCategories = selectedCategories;
    console.log("request: " + request.location);
    console.log("request:selectedCategories  " + request.selectedCategories);
    console.log("request " + JSON.stringify(request))
    return this.http.post(`${environment.apiUrl}/api/requests`, request);
  }

  /**getRequestById(id: number) {
    console.log("id: " + id);
    return this.http.get<Request>(`${environment.apiUrl}/api/requests/${id}`)
      .toPromise().catch((err: HttpErrorResponse) => {
      // simple logging, but you can do a lot more, see below
      console.error('An error occurred:', err.error);
      return null;
    });
  }*/

  getRequestById(id: number) {
    console.log("id: " + id);
    return this.http.get<Request>(`${environment.apiUrl}/api/requests/${id}`);
  }

  /**getRequestByUserId(userid: number) {
    console.log("userid: " + userid);
    return this.http.get<Request>(`${environment.apiUrl}/api/requests/users/${userid}`)
      .toPromise().catch((err: HttpErrorResponse) => {
      // simple logging, but you can do a lot more, see below
      console.error('An error occurred:', err.error);
      return null;
    });
  }*/

  getRequestByUserId(userid: number) {
    console.log("userid: " + userid);
    return this.http.get<Request>(`${environment.apiUrl}/api/requests/users/${userid}`);
  }

  /**getAllRequests() {
    return this.http.get<Request[]>(`${environment.apiUrl}/api/requests`)
      .toPromise().catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        //console.error('An error occurred:', err.error);
        return null;
      });
  }*/

  getAllRequests() {
    return this.http.get<Request[]>(`${environment.apiUrl}/api/requests`);
  }

  updateRequest(id, request: Request, selectedCategories: number[]) {
    console.log("request: " + request);
    request.requestId = id;
    request.userId = this.userService.userValue.userId;
    request.userNickName = this.userService.userValue.name;
    request.selectedCategories = selectedCategories;
      return this.http.put(`${environment.apiUrl}/api/requests/${id}`, request);
  }

  deleteRequest(id: number) {
    console.log("id: " + id)
      return this.http.delete<Request>(`${environment.apiUrl}/api/requests/${id}`);
          /**.pipe(map(x => {
            console.log("sssss " + x);
              return x;
          }, 
          error => {
            console.log("eeeeeee " + error);
          }));  */
  }
}
