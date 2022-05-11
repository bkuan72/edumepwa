import { takeUntil } from 'rxjs/operators';
import { CommonFn } from '../../shared/common-fn';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { AppSettings } from 'app/shared/app-settings';
import { Router } from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { SrvAuthTokenService, TokenStatus } from '../srv-auth-token/srv-auth-token.service';
import { LoginDTO } from 'app/dtos/login-dto';
import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable({
    providedIn: 'root',
})
export class AuthTokenSessionService implements OnDestroy {
    renewingAuthToken: boolean;
    settingsObs: Observable<AppSettings>;
    authUser: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    authUserOnChanged: BehaviorSubject<any>;


    constructor(
        private _auth: AuthenticationService,
        private _authToken: SrvAuthTokenService,
        private router: Router,
        private _appSetting: AppSettingsService,
        private _fn: CommonFn
    ) {

        this.renewingAuthToken = false;

        this.authUserOnChanged = new BehaviorSubject(this.authUser);

        // Set the private defaults
        this._unsubscribeAll = new Subject();
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
                            this.authUser);
                    });
            }
        });
        this._auth.authUserOnChange
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((authUser) => {
            this.authUser = authUser;
            this.authUserOnChanged.next(this.authUser);
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    get currentAuthUser(): any {
        return this.authUser;
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
    get devUser(): boolean {
        return this._authToken.isDevUser();
    }
    get bizUser(): boolean {
        return this._authToken.isBizUser();
    }

    canEdit(moduleCode: string): boolean {
        return this._authToken.canEdit(moduleCode);
    }
    canAdd(moduleCode: string): boolean {
        return this._authToken.canAdd(moduleCode);
    }
    canDelete(moduleCode: string): boolean {
        return this._authToken.canDelete(moduleCode);
    }
    canDev(moduleCode: string): boolean {
        return this._authToken.canDev(moduleCode);
    }
    canConfigure(moduleCode: string): boolean {
        return this._authToken.canConfigure(moduleCode);
    }


    isLoggedIn = (): boolean => {
        if (
            this.authUser &&
            this.authUser !== null &&
            !this._authToken.isExpired()
        ) {
            return true;
        }
        return false;
    }

    handleTokenStatus(
        status: TokenStatus,
        authUser: any
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
                                    username: authUser.username,
                                    email: authUser.email,
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
                            username: authUser.username,
                            email: authUser.email,
                        },
                    ]);
                }
                break;
        }
    }

    checkAuthTokenStatus(): void {
        const tokenStatus = this._authToken.tokenExpiryStatus();
        this.handleTokenStatus(tokenStatus,
                                this.authUser
                                );
    }

    login = (loginDTO: LoginDTO, rememberMe: boolean): Promise<any> => {
        return new Promise((resolve, reject) => {
            this._auth.login(loginDTO, rememberMe, this._authToken.setToken)
            .then((responseBody) => {
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

    renewAuthToken(): void {
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
                        username: this.authUser.username,
                        email: this.authUser.email,
                    },
                ]);
            }
        });
    }

    setAuthUserAvatar(avatar: any): void {
        this._auth.setAuthUserAvatar(avatar);
    }
}
