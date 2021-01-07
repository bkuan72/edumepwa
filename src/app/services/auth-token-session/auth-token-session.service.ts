import { CommonFn } from './../../shared/common-fn';
import { Observable } from 'rxjs';
import { AppSettings } from 'app/shared/app-settings';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { SrvAuthTokenService, TokenStatus } from '../srv-auth-token/srv-auth-token.service';
import { LoginDTO } from 'app/dtos/login-dto';
import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable({
    providedIn: 'root',
})
export class AuthTokenSessionService {
    renewingAuthToken: boolean;
    settingsObs: Observable<AppSettings>;

    constructor(
        private _auth: AuthenticationService,
        private _authToken: SrvAuthTokenService,
        private router: Router,
        private _appSetting: AppSettingsService,
        private _fn: CommonFn
    ) {
        this.renewingAuthToken = false;
        this.settingsObs = this._appSetting.settingsObs;
        this.settingsObs.subscribe((appSetting) => {
            if (appSetting.tokenRenewalIntervalInMin !== undefined) {
                this._authToken
                    .observeTokenExpiry(
                        this._fn.minToMillisec(
                            appSetting.tokenRenewalIntervalInMin
                        )
                    )
                    .subscribe((status: TokenStatus) => {
                        this.handleTokenStatus(status,
                            this._auth.userValue);
                    });
            }
        });
    }

    get userValue(): any {
        return this._auth.userValue;
    }

    get rememberMe(): boolean {
        return this._auth.rememberMe;
    }

    get tokenIsUndefined(): boolean {
        return this._authToken.isUndefined();
    }

    get authToken(): string {
        return this._authToken.getAuthToken();
    }

    get adminUser(): boolean {
        return this._authToken.isAdminUser();
    }

    isLoggedIn = (): boolean => {
        if (
            this._auth.userValue &&
            this._auth.userValue !== null &&
            !this._authToken.isExpired()
        ) {
            return true;
        }
        return false;
    }

    handleTokenStatus(
        status: TokenStatus,
        userValue: any
    ): void {
        switch (status) {
            case TokenStatus.ALIVE:
                break;
            case TokenStatus.UNDEFINED:
                break;
            case TokenStatus.EXPIRING:
                if (!this.renewingAuthToken) {
                    this.renewingAuthToken = true;
                    this._auth.renewAuthToken()
                    .then((responseBody) => {
                        this._authToken.setToken(responseBody, this._auth.rememberMe);
                        this.renewingAuthToken = false;
                    })
                    .catch(() => {
                        this.renewingAuthToken = false;
                        if (!this.router.isActive('auth/lock', false)) {
                            this.router.navigate([
                                'auth/lock',
                                {
                                    user_name: userValue.user_name,
                                    email: userValue.email,
                                },
                            ]);
                        }
                    });
                }
                break;
            case TokenStatus.EXPIRED:
                if (!this.router.isActive('auth/lock', false)) {
                    this.router.navigate([
                        'auth/lock',
                        {
                            user_name: userValue.user_name,
                            email: userValue.email,
                        },
                    ]);
                }
                break;
        }
    }

    checkAuthTokenStatus(): void {
        const tokenStatus = this._authToken.tokenExpiryStatus();
        this.handleTokenStatus(tokenStatus,
                                this._auth.userValue
                                );
    }

    login = (loginDTO: LoginDTO, rememberMe: boolean): Promise<any> => {
        return new Promise((resolve, reject) => {
            this._auth.login(loginDTO, rememberMe)
            .then((responseBody) => {
                this._authToken.setToken(responseBody, rememberMe);
                resolve(responseBody);
            })
            .catch(() => {
                reject(undefined);
            });
        });
    }

    resetAuthUser = () => {
        this._auth.resetAuthUser();
        this._authToken.deleteToken();
    }

    logout = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            this._auth.logout()
            .then(() => {
                this._authToken.deleteToken();
                resolve(true);
            })
            .catch(() => { 
                this._authToken.deleteToken();
                reject(false);
            });
        });
    }
}
