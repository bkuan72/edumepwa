import { Router } from '@angular/router';
import { SrvHttpService } from './../http-connect/srv-http.service';
import { SrvApiEnvEnum } from './../../shared/SrvApiEnvEnum';
import { LocalStoreVarEnum } from './../../shared/local-store-var-enum';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppSettings } from '../../shared/app-settings';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private userProfileSubject: BehaviorSubject<any>;
    constructor(
        private _http: SrvHttpService,
        private router: Router
    ) {
        this.userProfileSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(LocalStoreVarEnum.SESSION_USER_PROFILE)));
    }
    public get userProfileValue(): any {
        return this.userProfileSubject.value;
    }

    goToUserProfile(userId: string): void {
        const httpConfig = this._http.getSrvHttpConfig(
            SrvApiEnvEnum.basicUserByUserId,
            [userId]
        );
        this._http
            .Get(httpConfig, true)
            .then((user) => {
                localStorage.setItem(LocalStoreVarEnum.SESSION_USER_PROFILE, JSON.stringify(user));
                this.userProfileSubject.next(user);
                this.router.navigate(['/pages/profile']);
            })
            .catch(() => {
                this.router.navigateByUrl('errors/error-404');
            });

    }
}