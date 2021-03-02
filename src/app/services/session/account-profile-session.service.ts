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
    accountProfileOnChange: BehaviorSubject<any>;
    constructor(
        private _http: SrvHttpService,
        private router: Router,
        private _authTokenSession: AuthTokenSessionService
    ) {
        this.accountProfileOnChange = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(LocalStoreVarEnum.SESSION_ACCOUNT_PROFILE)));
    }
    public get accountProfileValue(): any {
        return this.accountProfileOnChange.value;
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
            .then((account) => {
                this._authTokenSession.checkAuthTokenStatus();

                localStorage.setItem(LocalStoreVarEnum.SESSION_ACCOUNT_PROFILE, JSON.stringify(account));
                this.accountProfileOnChange.next(account);
                this.router.navigate(['/pages/account-profile']);
            })
            .catch(() => {
                this.router.navigateByUrl('errors/error-404');
            });

    }
}