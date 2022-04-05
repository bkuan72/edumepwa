import { AccountsService } from 'app/services/account/account.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountLoadedGuard implements CanActivate {
  constructor(
    private router: Router,
    private _accountService: AccountsService
  ) { }



  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log ('validating AccountLoaded Guard');
    if (this._accountService.account === undefined) {
      this.router.navigate(['search-modern']);
      return false;
    }
    return true;
  }
}
