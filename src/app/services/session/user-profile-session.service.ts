import { Router } from '@angular/router';
import { SrvHttpService } from '../http-connect/srv-http.service';
import { SrvApiEnvEnum } from '../../shared/SrvApiEnvEnum';
import { LocalStoreVarEnum } from '../../shared/local-store-var-enum';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthTokenSessionService } from '../auth-token-session/auth-token-session.service';

@Injectable({
    providedIn: 'root',
})
export class UserProfileSessionService {
    userProfileOnChange: BehaviorSubject<any>;
    constructor(
        private _http: SrvHttpService,
        private router: Router,
        private _authTokenSession: AuthTokenSessionService
    ) {
        this.userProfileOnChange = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(LocalStoreVarEnum.SESSION_USER_PROFILE)));
    }
    public get userProfileValue(): any {
        return this.userProfileOnChange.value;
    }

    setProfileAvatar(avatar: string): void {
        if (this.userProfileValue) {
            this.userProfileValue.avatar = avatar;
            localStorage.setItem(LocalStoreVarEnum.SESSION_USER_PROFILE, JSON.stringify(this.userProfileValue));
            this.userProfileOnChange.next(this.userProfileValue);
        }
    }

    goToUserProfile(userId: string): void {
        const httpConfig = this._http.getSrvHttpConfig(
            SrvApiEnvEnum.basicUserByUserId,
            [userId]
        );
        this._http
            .Get(httpConfig, true)
            .then((user) => {
                this._authTokenSession.checkAuthTokenStatus();

                localStorage.setItem(LocalStoreVarEnum.SESSION_USER_PROFILE, JSON.stringify(user));
                this.userProfileOnChange.next(user);
                this.router.navigate(['/pages/profile']);
            })
            .catch(() => {
                this.router.navigateByUrl('errors/error-404');
            });

    }
}