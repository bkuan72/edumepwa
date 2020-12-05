import { CommonFn, DateAddIntervalEnum } from './../../shared/common-fn';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

interface LoginResponse {
    data: object;
    token: {
        expiresIn: number;
        token: string;
    }
}
interface DataStoredInToken {
    user_id: string;
    uuid: string;
    adminUser: boolean;
    site_code: string;
    createTimeStamp: string;
    expireInMin: number;
  }


@Injectable({
  providedIn: 'root'
})
export class SrvAuthTokenService {
  private expireInMin: number;
  private tokenStr: string;
  private tokenData: DataStoredInToken;
  private expiryDate: Date;

  AUTH_TOKEN = 'AuthorizationToken';
  AUTH_TOKEN_EXPIRY_IN = 'AuthorizationTokenExpiryIn';

  constructor(
    private _authTokenService: CookieService,
    private _commonFn: CommonFn
  ) {
    if (this._authTokenService.check(this.AUTH_TOKEN)) {
        this.tokenStr = this._authTokenService.get(this.AUTH_TOKEN);
        this.expireInMin = parseInt(this._authTokenService.get(this.AUTH_TOKEN_EXPIRY_IN), 0);
        this.tokenData = jwt_decode(this.tokenStr) as DataStoredInToken;
        this.expiryDate = new Date(this.tokenData.createTimeStamp);
        this.expiryDate = this._commonFn.dateAdd(this.expiryDate,
            DateAddIntervalEnum.MINUTE,
            this.tokenData.expireInMin);
    }
  }

  getAuthToken = (): string => {
      let bearerStr = 'Bearer ';
      if (this.tokenStr) {
          bearerStr += this.tokenStr;
      }
      return bearerStr;
  }
  getToken = () => {
      return this.tokenStr;
  }
  setToken = (responseBody: LoginResponse) => {
    if (responseBody && responseBody.token) {
        this.tokenData = jwt_decode(responseBody.token.token) as DataStoredInToken;
        if (this.tokenData) {
            this.tokenStr = responseBody.token.token;
            this._authTokenService.set(this.AUTH_TOKEN,
                this.tokenStr
                );
            this.expireInMin = responseBody.token.expiresIn;
            this._authTokenService.set(this.AUTH_TOKEN_EXPIRY_IN,
                this.expireInMin.toString()
                );
            this.expiryDate = new Date(this.tokenData.createTimeStamp);
            this.expiryDate = this._commonFn.dateAdd(this.expiryDate,
                                                    DateAddIntervalEnum.MINUTE,
                                                    this.tokenData.expireInMin);
        } else {
            this.deleteToken();
        }
    } else {
        this.deleteToken();
    }
  }

  deleteToken = () => {
    if (this._authTokenService.check(this.AUTH_TOKEN)) {
        this._authTokenService.delete(this.AUTH_TOKEN);
        this.tokenStr = undefined;
    }
    if (this._authTokenService.check(this.AUTH_TOKEN_EXPIRY_IN)) {
        this._authTokenService.delete(this.AUTH_TOKEN_EXPIRY_IN);
        this.expireInMin = 0;
    }
    this.tokenData = undefined;
    this.expiryDate = undefined;
    this.expireInMin = undefined;
  }

  isUndefined(): boolean {
      if (this.tokenStr) {
          return false;
      }
      return true;
  }
  isExpired(): boolean {
      if (this.tokenData && this.expiryDate) {
        if (this.expiryDate > new Date()) {
            return false;
        }
      }
      return true;
  }

  isExpiringSoon(): boolean {
    if (this.tokenStr && this.expiryDate) {
        const expDateMillisec = this.expiryDate.valueOf();
        const currentDateMillisec = (new Date()).valueOf();
        // expire in 1 hour
        if (expDateMillisec > currentDateMillisec - (60000 * this.expireInMin)) {
            return true;
        }
    }
    return false;
  }

  tokenExpiry = (): Observable<boolean> => {
    return new Observable (observer => {
        setInterval(() => {
          return this.isExpiringSoon();
        }, 500);
      });
    }
}
