import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User, Request } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username, password) {
        console.log(username + password);
        console.log(environment.apiUrl);
        return this.http.post<User>(`${environment.apiUrl}/api/users/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                localStorage.setItem('token', user.token);
                console.log("user.token" + user.token);
                console.log("user: " + user.name);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.userSubject.next(null);
        this.router.navigate(['/']);
    }

    register(user: User) {
        console.log("User: " + user);
        console.log(environment.apiUrl);
        return this.http.post(`${environment.apiUrl}/api/users/register`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/api/users`);
    }

    getById(userId: number) {
        return this.http.get<User>(`${environment.apiUrl}/api/users/${userId}`);
    }

    getUsersByUserIds(userIds) {
        return this.http.get<User[]>(`${environment.apiUrl}/api/users?id=`+userIds.join(","));
    }

    /**getRequestByUserId(userid: number) {
        console.log("userid: " + userid);
        return this.http.get<Request>(`${environment.apiUrl}/api/users/${userid}/requests`)
          .toPromise().catch((err: HttpErrorResponse) => {
          // simple logging, but you can do a lot more, see below
          console.error('An error occurred:', err.error);
          return null;
        });
      }*/

    getRequestByUserId(userid: number) {
        console.log("userid: " + userid);
        return this.http.get<Request[]>(`${environment.apiUrl}/api/users/${userid}/requests`);
        /**.pipe(catchError(error => {
            console.log("Errorrrrrrrrr " + error.status);
            if(error.status === 401) {
                this.logout();
            }
            return throwError(error);
        })); */
    }

    getSubscribedRequestByUserId(userid: number) {
        console.log("userid: " + userid);
        return this.http.get<Request[]>(`${environment.apiUrl}/api/users/${userid}/subscribedrequests`);
        /**.pipe(catchError(error => {
            console.log("Errorrrrrrrrr " + error.status);
            if(error.status === 401) {
                this.logout();
            }
            return throwError(error);
        })); */
    }

    refreshLocalStorageUser(userId) {
        console.log("userId " + userId);
        this.getById(userId).pipe(map(x => {
            console.log("map " + x.userId + x.token);
            console.log("map 1" + JSON.stringify(x));
            // update stored user if the logged in user updated their own record
            if (userId == this.userValue.userId) {
                // update local storage
                console.log("fsdfsdfsdfs" + JSON.stringify(this.userValue));
                delete (<User>x).token;
                const user = { ...this.userValue, ...x };
                localStorage.setItem('user', JSON.stringify(user));
                console.log("fsdfsdfsdfs222" + JSON.stringify(this.userValue));
                // publish updated user to subscribers
                this.userSubject.next(user);
                console.log("fsdfsdfsdfs333" + JSON.stringify(this.userValue));
            }
            return x;
        })).subscribe(data => {
            console.log("subscribe " + data);
            if (userId == this.userValue.userId) {
                // update local storage
                console.log("fsdfsdfsdfs" + JSON.stringify(this.userValue));
                delete data.token;
                const user = { ...this.userValue, ...data };
                localStorage.setItem('user', JSON.stringify(user));
                console.log("fsdfsdfsdfs222" + JSON.stringify(this.userValue));

                // publish updated user to subscribers
                this.userSubject.next(user);
                console.log("fsdfsdfsdfs333" + JSON.stringify(this.userValue));
            }
        });
    }

    update(userId, params) {
        return this.http.put(`${environment.apiUrl}/api/users/${userId}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                console.log("dsfsdfsf" + userId + this.userValue.userId);
                if (userId == this.userValue.userId) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));
                    console.log(JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    updateMessagedUsers(userId, value) {
        console.log("userId " + userId);
        console.log("value " + value);
        console.log("fsdf " + JSON.stringify(value));
        return this.http.patch(`${environment.apiUrl}/api/users/${userId}`, value)
            .pipe(map(x  => {
                console.log("fsdfsdfsdfs x" + JSON.stringify(x));
                // update stored user if the logged in user updated their own record
                if (userId == this.userValue.userId) {
                    // update local storage
                    console.log("fsdfsdfsdfs this.userValue" + JSON.stringify(this.userValue));
                   /** const copyX: User = {
                        ...<User>x
                    };
                    delete copyX.token; */
                    delete (<User>x).token;
                    const user = { ...this.userValue, ...x };
                    localStorage.setItem('user', JSON.stringify(user));
                    console.log("fsdfsdfsdfs this.userValue1" + JSON.stringify(this.userValue));
                    // publish updated user to subscribers
                    this.userSubject.next(user);
                    console.log("fsdfsdfsdfs this.userValu2" + JSON.stringify(this.userValue));
                }
                return x;
            }));
    }

    delete(userId: number) {
        return this.http.delete(`${environment.apiUrl}/api/users/${userId}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (userId == this.userValue.userId) {
                    this.logout();
                }
                return x;
            }));
    }
}
