import { CommonFn, DateAddIntervalEnum } from '../../shared/common-fn';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { AppSettings } from 'app/shared/app-settings';
import { Router } from '@angular/router';

export enum TokenStatus {
    ALIVE,
    EXPIRED,
    EXPIRING,
    UNDEFINED,
}
interface LoginResponse {
    data: object;
    token: {
        expiresIn: number;
        token: string;
    };
}
interface DataStoredInToken {
    user_id: string;
    uuid: string;
    adminUser: boolean;
    site_code: string;
    createTimeStamp: string;
    expiryInSec: number;
}

@Injectable({
    providedIn: 'root',
})
export class SrvAuthTokenService {
    private expiryInSec: number;
    private tokenStr: string;
    private tokenData: DataStoredInToken;
    private expiryDate: Date;
    private settings: AppSettings;

    AUTH_TOKEN = 'AuthorizationToken';
    AUTH_TOKEN_EXPIRY_IN = 'AuthorizationTokenExpiryIn';

    constructor(
        private _commonFn: CommonFn,
        private _appSettings: AppSettingsService,
        private router: Router
    ) {
        this.settings = this._appSettings.settingsValue;
        if (localStorage.getItem(this.AUTH_TOKEN) !== null) {
            this.tokenStr = localStorage.getItem(this.AUTH_TOKEN);
            this.expiryInSec = parseInt(
                localStorage.getItem(this.AUTH_TOKEN_EXPIRY_IN),
                0
            );
            this.tokenData = jwt_decode(this.tokenStr) as DataStoredInToken;
            this.expiryDate = new Date(this.tokenData.createTimeStamp);
            this.expiryDate = this._commonFn.dateAdd(
                this.expiryDate,
                DateAddIntervalEnum.SECOND,
                this.tokenData.expiryInSec
            );
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
            this.tokenData = jwt_decode(
                responseBody.token.token
            ) as DataStoredInToken;
            if (this.tokenData) {
                this.tokenStr = responseBody.token.token;
                this.expiryInSec = responseBody.token.expiresIn;
                this.expiryDate = new Date(this.tokenData.createTimeStamp);
                this.expiryDate = this._commonFn.dateAdd(
                    this.expiryDate,
                    DateAddIntervalEnum.SECOND,
                    this.tokenData.expiryInSec
                );
                if (rememberMe) {
                    localStorage.setItem(this.AUTH_TOKEN, this.tokenStr);

                    localStorage.setItem(
                        this.AUTH_TOKEN_EXPIRY_IN,
                        this.expiryInSec.toString()
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
            this.expiryInSec = 0;
        }
        this.tokenData = undefined;
        this.expiryDate = undefined;
        this.expiryInSec = undefined;
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

    tokenExpiryStatus(): TokenStatus {
        if (this.tokenStr && this.expiryDate) {
            const expDateMillisec = this.expiryDate.valueOf();
            const currentDateMillisec = new Date().valueOf();

            if (expDateMillisec < currentDateMillisec) {
                return TokenStatus.EXPIRED;
            } else {
                if (
                    expDateMillisec <
                    currentDateMillisec -
                        this._commonFn.minToMillisec(
                            this.settings.tokenRenewBeforeMin
                        )
                ) {
                    return TokenStatus.EXPIRING;
                }
            }
            return TokenStatus.ALIVE;
        }
        return TokenStatus.UNDEFINED;
    }

    observeTokenExpiry = (interval: number): Observable<TokenStatus> => {
        return new Observable((observer) => {
            setInterval(() => {
                observer.next(this.tokenExpiryStatus());
            }, interval);
        });
    }

    isAdminUser(): boolean {
        let admin = false;
        if (this.tokenData && this.tokenData.adminUser &&
            !this.isExpired()) {
            admin = true;
        }
        return admin;
    }

}
