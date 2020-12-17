import { CommonFn, DateAddIntervalEnum } from './../../shared/common-fn';
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
    private _commonFn: CommonFn
  ) {
    if (localStorage.getItem(this.AUTH_TOKEN) !== null) {
        this.tokenStr = localStorage.getItem(this.AUTH_TOKEN);
        this.expireInMin = parseInt(localStorage.getItem(this.AUTH_TOKEN_EXPIRY_IN), 0);
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
  setToken = (responseBody: LoginResponse, rememberMe: boolean) => {
    if (responseBody && responseBody.token) {
        this.tokenData = jwt_decode(responseBody.token.token) as DataStoredInToken;
        if (this.tokenData) {
            this.tokenStr = responseBody.token.token;
            this.expireInMin = responseBody.token.expiresIn;
            this.expiryDate = new Date(this.tokenData.createTimeStamp);
            this.expiryDate = this._commonFn.dateAdd(this.expiryDate,
                                                    DateAddIntervalEnum.MINUTE,
                                                    this.tokenData.expireInMin);
            if (rememberMe) {
                localStorage.setItem(this.AUTH_TOKEN,
                    this.tokenStr
                    );

                localStorage.setItem(this.AUTH_TOKEN_EXPIRY_IN,
                    this.expireInMin.toString()
                    );
            }
        } else {
            this.deleteToken();
        }
    } else {
        this.deleteToken();
    }
  }

  deleteToken = () => {
    if (localStorage.getItem(this.AUTH_TOKEN) !== null) {
        localStorage.removeItem(this.AUTH_TOKEN);
        this.tokenStr = undefined;
    }
    if (localStorage.getItem(this.AUTH_TOKEN_EXPIRY_IN) !== null) {
        localStorage.removeItem(this.AUTH_TOKEN_EXPIRY_IN);
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
