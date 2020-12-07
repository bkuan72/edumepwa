import { LocalStoreVarEnum } from './../../shared/local-store-var-enum';
import { Router } from '@angular/router';
import { AlertService } from './../alert/alert.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { RegisterDTO } from './../../dtos/register-dto';
import { LoginDTO } from './../../dtos/login-dto';
import { SrvApiEnvEnum } from './../../shared/SrvApiEnvEnum';
import { SrvAuthTokenService } from 'app/services/srv-cookie/srv-auth-token.service';
import { Injectable } from '@angular/core';
import { SrvHttpService } from '../http-connect/srv-http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
    private userSubject: BehaviorSubject<any>;
    public user: Observable<any>;


  renewCookieObserver: Observable<boolean>;

  constructor(
      private _http: SrvHttpService,
      private _authToken: SrvAuthTokenService,
      private _logger: LoggerService,
      private _alert: AlertService
  ) {
    this.userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(LocalStoreVarEnum.USER)));
    this.user = this.userSubject.asObservable();
    this._authToken.tokenExpiry().subscribe((expiring) => {
        if (expiring) {
            this.renewCookie();
        }
    });
  }

  public get userValue(): any {
    return this.userSubject.value;
}

  registerNewUser = (registerDTO: RegisterDTO): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.register,
            undefined,
            registerDTO);
        this._http.Post(httpConfig, false).then ((responseBody) => {
                localStorage.setItem(LocalStoreVarEnum.USER, JSON.stringify(responseBody.data));
                this.userSubject.next(responseBody.data);
                resolve(true);
            })
            .catch((res: HttpErrorResponse) => {
                this._alert.error(res.error);
                this._logger.error('Error Registering User', res);
                reject(false);
            });
      });
  }

  renewCookie = (): void => {

  }

  login = (loginDTO: LoginDTO): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.login,
            undefined,
            loginDTO);
        this._http.Post(httpConfig, false).then ((responseBody) => {
                localStorage.setItem(LocalStoreVarEnum.USER, JSON.stringify(responseBody.data));
                this.userSubject.next(responseBody.data);
                this._authToken.setToken(responseBody);
                resolve(true);
            })
            .catch((res: HttpErrorResponse) => {
                // this._alert.error(res.error);
                this._logger.error('Error Logging In', res);
                reject(false);
            });
      });
  }

  logout = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.logout);
        this._http.Post(httpConfig, false).then ((res) => {
                    // remove user from local storage and set current user to null
                localStorage.removeItem(LocalStoreVarEnum.USER);
                this.userSubject.next(null);
                this._authToken.deleteToken();
                resolve(true);
            })
            .catch((res) => {
                // remove user from local storage and set current user to null
                localStorage.removeItem(LocalStoreVarEnum.USER);
                this.userSubject.next(null);
                this._authToken.deleteToken();
                this._logger.error('Error Logging Out', res);
                reject(false);
            });
    });
  }

  isLoggedIn = (): boolean => {
      if (this._authToken.isExpired()) {
          return false;
      }
      return true;
  }

}
