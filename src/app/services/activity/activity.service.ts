import { Injectable } from '@angular/core';
import { SrvApiEnvEnum } from 'app/shared/SrvApiEnvEnum';
import { AuthTokenSessionService } from '../auth-token-session/auth-token-session.service';
import { SrvHttpService } from '../http-connect/srv-http.service';

@Injectable({
    providedIn: 'root',
})
export class ActivityService {
    constructor(
        private _http: SrvHttpService,
        private _authTokenSession: AuthTokenSessionService
    ) {}

    deleteActivity(activityId: any): Promise<void> {
        return new Promise((resolve) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.removeActivity,
                [activityId]
            );
            this._http.PatchObs(httpConfig, true).subscribe((newUser: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                resolve();
            }, resolve);
        });
    }
}
