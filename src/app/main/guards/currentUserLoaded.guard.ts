import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserLoadedGuard implements CanActivate {
  constructor(
    private router: Router,
    private _auth: AuthTokenSessionService
  ) { }



  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log ('validating Auth Guard')
    if (this._auth.currentAuthUser) {
      return true;
    }
    this.router.navigate(['search-modern']);
    return false;
  }
}
