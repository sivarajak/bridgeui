import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}

  /**canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('token')) {
      return state.url.startsWith('/profile')
        ? true
        : (this.router.navigate(['/']), false);
    } else {
      return state.url.startsWith('/profile')
        ? (this.router.navigate(['/']), false)
        : true;
    }
  }*/
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('token')) {
        // logged in so return true
        return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
}
}
