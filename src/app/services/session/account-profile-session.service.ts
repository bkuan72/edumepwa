import { Router } from '@angular/router';
import { SrvHttpService } from '../http-connect/srv-http.service';
import { SrvApiEnvEnum } from '../../shared/SrvApiEnvEnum';
import { LocalStoreVarEnum } from '../../shared/local-store-var-enum';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthTokenSessionService } from '../auth-token-session/auth-token-session.service';

@Injectable({
    providedIn: 'root',
})
export class AccountProfileSessionService {
    account: any;
    accountProfileOnChange: BehaviorSubject<any>;
    userAccountOnChange: BehaviorSubject<any>;

    userAccounts: any[];


    constructor(
        private _http: SrvHttpService,
        private router: Router,
        private _authTokenSession: AuthTokenSessionService
    ) {
        this.accountProfileOnChange = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(LocalStoreVarEnum.SESSION_ACCOUNT_PROFILE)));
        this.userAccountOnChange = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(LocalStoreVarEnum.SESSION_USER_ACCOUNT)));
    }
    public get accountProfileValue(): any {
        return this.accountProfileOnChange.value;
    }
    public get userAccountValue(): any {
        return this.userAccountOnChange.value;
    }

    setProfileAvatar(avatar: string): void {
        if (this.accountProfileValue) {
            this.accountProfileValue.avatar = avatar;
            localStorage.setItem(LocalStoreVarEnum.SESSION_ACCOUNT_PROFILE, JSON.stringify(this.accountProfileValue));
            this.accountProfileOnChange.next(this.accountProfileValue);
        }
    }

    goToAccountProfile(accountId: string): void {
        const httpConfig = this._http.getSrvHttpConfig(
            SrvApiEnvEnum.basicAccountByAccountId,
            [accountId]
        );
        this._http
            .Get(httpConfig, true)
            .then((account: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.getBasicAccount(account.id).finally(() => {
                    localStorage.setItem(LocalStoreVarEnum.SESSION_ACCOUNT_PROFILE, JSON.stringify(account));
                    this.accountProfileOnChange.next(account);
                    this.router.navigate(['/pages/account-profile']);
                });
            })
            .catch(() => {
                this.router.navigateByUrl('errors/error-404');
            });

    }

    getBasicAccount(accountId: string): Promise<any[]> {
        return new Promise<any[]>((resolve) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.basicAccountByAccountId,
                [accountId]
            );
            this._http
                .Get(httpConfig, true)
                .then((account: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.account = account;
                    this.getAccountUser(account.id).finally(() => {
                        localStorage.setItem(LocalStoreVarEnum.SESSION_ACCOUNT_PROFILE, JSON.stringify(account));
                        this.userAccountOnChange.next(account);
                        resolve(account);
                    });
                })
                .catch(() => {
                    this.userAccountOnChange.next([]);
                    resolve([]);
                });
        });
    }

    getAccountUser(accountId: string): Promise<any[]> {
        return new Promise<any[]>((resolve) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userAccountsByUserIdAccountId,
                [   this._authTokenSession.currentAuthUser.id,
                    accountId
                ]
            );
            this._http
                .Get(httpConfig, true)
                .then((userAccounts: any[]) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.userAccounts = userAccounts;

                    localStorage.setItem(LocalStoreVarEnum.SESSION_USER_ACCOUNT, JSON.stringify(userAccounts));
                    this.userAccountOnChange.next(userAccounts);
                    resolve(userAccounts);
                })
                .catch(() => {
                    this.userAccountOnChange.next([]);
                    resolve([]);
                });
        });
    }

    accountHolder(userId): boolean {
        let holder = false;
        if (this.userAccounts) {
            this.userAccounts.some((accUser) => {
                if (accUser.user_id === userId && accUser.acc_type === 'HOLDER') {
                    holder = true;
                    return true;
                }
            });
        }
        return holder;
    }
}
