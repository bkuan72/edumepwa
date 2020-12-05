import { HttpResponse } from '@angular/common/http';
import { RegisterDTO } from './../../dtos/register-dto';
import { LoginDTO } from './../../dtos/login-dto';
import { SrvApiEnvEnum } from './../../shared/SrvApiEnvEnum';
import { SrvAuthTokenService } from 'app/services/srv-cookie/srv-auth-token.service';
import { Injectable } from '@angular/core';
import { SrvHttpService } from '../http-connect/srv-http.service';
import { Observable } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  renewCookieObserver: Observable<boolean>;

  constructor(
      private _http: SrvHttpService,
      private _authToken: SrvAuthTokenService,
      private _logger: LoggerService
  ) {
    this._authToken.tokenExpiry().subscribe((expiring) => {
        if (expiring) {
            this.renewCookie();
        }
    });
  }

  registerNewUser = (registerDTO: RegisterDTO): Promise<boolean> => {
    return new Promise((resolve) => {
        const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.register,
            [],
            registerDTO);
        this._http.Post(httpConfig, false).then (() => {
                resolve(true);
            })
            .catch((res) => {
                this._logger.error('Error Registering User', res);
                resolve(false);
            });
      });
  }

  renewCookie = (): void => {

  }

  login = (loginDTO: LoginDTO): Promise<boolean> => {
      return new Promise((resolve) => {
        const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.login,
            [],
            loginDTO);
        this._http.Post(httpConfig, false).then ((responseBody) => {
                this._authToken.setToken(responseBody);
                resolve(true);
            })
            .catch((res) => {
                this._logger.error('Error Logging In', res);
                resolve(false);
            });
      });
  }

  logout = (): Promise<boolean> => {
    return new Promise((resolve) => {
        const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.logout);
        this._http.Post(httpConfig, false).then ((res) => {
                this._authToken.deleteToken();
                resolve(true);
            })
            .catch((res) => {
                this._authToken.deleteToken();
                this._logger.error('Error Logging Out', res);
                resolve(false);
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
