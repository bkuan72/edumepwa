import { AuthTokenSessionService } from './../../services/auth-token-session/auth-token-session.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private _auth: AuthTokenSessionService
  ) { }



  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log ('validating Auth Guard');
    if (!this._auth.isLoggedIn() || !this._auth.adminUser) {
      this.router.navigate(['search-modern']);
      return false;
    }
    return true;
  }
}
