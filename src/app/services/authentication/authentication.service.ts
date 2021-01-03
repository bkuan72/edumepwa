import { CommonFn } from './../../shared/common-fn';
import { AppSettingsService } from 'app/services/app-settings/app-settings.service';
import { LocalStoreVarEnum } from './../../shared/local-store-var-enum';
import { AlertService } from './../alert/alert.service';
import { HttpErrorResponse, } from '@angular/common/http';
import { RegisterDTO } from './../../dtos/register-dto';
import { LoginDTO } from './../../dtos/login-dto';
import { SrvApiEnvEnum } from './../../shared/SrvApiEnvEnum';
import { SrvAuthTokenService } from 'app/services/srv-cookie/srv-auth-token.service';
import { Injectable } from '@angular/core';
import { SrvHttpService } from '../http-connect/srv-http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { AppSettings } from 'app/shared/app-settings';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<any>;
  rememberMe: boolean;
  settingsObs: Observable<AppSettings>;


  renewCookieObserver: Observable<boolean>;

  constructor(
      private _http: SrvHttpService,
      private _authToken: SrvAuthTokenService,
      private _logger: LoggerService,
      private _appSetting: AppSettingsService,
      private _alert: AlertService,
      private _fn: CommonFn,
  ) {
    this.rememberMe = true;
    this.userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(LocalStoreVarEnum.USER)));
    this.settingsObs = this._appSetting.settingsObs;
    this.settingsObs.subscribe((appSetting) => {
        if (appSetting.tokenRenewalIntervalInMin !== undefined) {
            this._authToken.tokenExpiry(this._fn.minToMillisec(appSetting.tokenRenewalIntervalInMin)).subscribe((expiring) => {
                if (expiring) {
                    this.renewCookie();
                }
            });
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
                // this._alert.error(res.error);
                this._logger.error('Error Registering User', res);
                reject(false);
            });
      });
  }

  renewCookie = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.renewToken);
        this._http.Post(httpConfig, false).then ((responseBody) => {
                localStorage.setItem(LocalStoreVarEnum.USER, JSON.stringify(responseBody.data));
                this.userSubject.next(responseBody.data);
                this._authToken.setToken(responseBody, this.rememberMe);
                resolve(true);
            })
            .catch((res: HttpErrorResponse) => {
                // this._alert.error(res.error);
                this._logger.error('Error Renewing Auth Token', res);
                reject(false);
            });
      });
  }

  login = (loginDTO: LoginDTO, rememberMe: boolean): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        this.rememberMe = rememberMe;
        const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.login,
            undefined,
            loginDTO);
        this._http.Post(httpConfig, false).then ((responseBody) => {
                localStorage.setItem(LocalStoreVarEnum.USER, JSON.stringify(responseBody.data));
                this.userSubject.next(responseBody.data);
                this._authToken.setToken(responseBody, this.rememberMe);
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
                this.userSubject.next(undefined);
                this._authToken.deleteToken();
                resolve(true);
            })
            .catch((res) => {
                // remove user from local storage and set current user to null
                localStorage.removeItem(LocalStoreVarEnum.USER);
                this.userSubject.next(undefined);
                this._authToken.deleteToken();
                this._logger.error('Error Logging Out', res);
                reject(false);
            });
    });
  }

  isLoggedIn = (): boolean => {
      if (this.userValue && this.userValue !== null && !this._authToken.isExpired()) {
          return true;
      }
      return false;
  }

  emailConfirmation(email: string, regConfirmKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.regConfirmation,
            [email, regConfirmKey]);
        this._http.Get(httpConfig, false).then ((res) => {
                resolve();
            })
            .catch((res) => {
                this._logger.error('Error Confirming Email', res);
                reject();
            });
    });
  }
  resetPasswordConfirmation(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.resetPassword,
            [email]);
        this._http.Get(httpConfig, false).then ((res) => {
                resolve();
            })
            .catch((res) => {
                this._logger.error('Error Resetting Password', res);
                reject();
            });
    });
  }

  validResetPasswordKey(email: string, resetPasswordKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.validResetPasswordKey,
            [email, resetPasswordKey]);
        this._http.Get(httpConfig, false).then ((res: { valid: boolean }) => {
                if (res.valid) {
                    resolve();
                } else {
                    this._logger.error('Invalid Reset Password Key', res);
                    reject();
                }
            })
            .catch((res) => {
                this._logger.error('Error Reset Email Password', res);
                reject();
            });
    });
  }

  updateUserPassword(email: string, resetPasswordKey: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.newPasswordConfirmation,
            [email, resetPasswordKey, newPassword]);
        this._http.Get(httpConfig, false).then ((res) => {
                resolve();
            })
            .catch((res) => {
                this._logger.error('Error Reset Email Password', res);
                reject();
            });
    });
  }

}
