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

    /**
     * Delete an activity
     * @param activityId activities.id
     * @returns
     */
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

    /**
     * Get user activities
     */
    getActivities(userId): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.activities,
                [userId, '10']
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((activities: any[]) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    resolve(activities);
                }, reject);
        });
    }

    /**
     * Delete an AccountGroup activity
     * @param activityId activities.id
     * @returns
     */
    deleteAccountGroupActivity(activityId: any): Promise<void> {
        return new Promise((resolve) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.removeAccountGroupActivity,
                [activityId]
            );
            this._http.PatchObs(httpConfig, true).subscribe((newUser: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                resolve();
            }, resolve);
        });
    }

    /**
     * Get account activities
     */
    getAccountActivities(accountId): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountActivities,
                [accountId, '10']
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((activities: any[]) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    resolve(activities);
                }, reject);
        });
    }

    /**
     * Get account activities
     */
    getGroupActivities(groupId): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.groupActivities,
                [groupId, '10']
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((activities: any[]) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    resolve(activities);
                }, reject);
        });
    }
}
