import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CommonFn } from 'app/shared/common-fn';
import { SrvApiEnvEnum } from 'app/shared/SrvApiEnvEnum';
import { AnySrvRecord } from 'dns';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AlertService } from '../alert/alert.service';
import { AuthTokenSessionService } from '../auth-token-session/auth-token-session.service';
import { SrvHttpService } from '../http-connect/srv-http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements Resolve<any[]>, OnDestroy {
    users: any[];
    usersDTO: any;
    usersUpdDTO: any;
    usersSchema: any;
    usersByKeyword: any[];

    usersOnChanged: BehaviorSubject<any[]>;
    userCodesOnChanged: BehaviorSubject<string[]>;
    usersDTOOnChanged: BehaviorSubject<any[]>;
    usersUpdDTOOnChanged: BehaviorSubject<any[]>;
    usersSchemaOnChanged: BehaviorSubject<any[]>;
    usersByKeywordOnChanged: BehaviorSubject<any[]>;
    _unsubscribeAll: Subject<any>;

constructor(
    private _http: SrvHttpService,
    private _authTokenSession: AuthTokenSessionService,
    private _alertService: AlertService,
    private _fn: CommonFn
) {
    this.users = [];
    this.usersByKeyword = [];
    this.usersOnChanged = new BehaviorSubject(this.users);
    this.usersDTOOnChanged = new BehaviorSubject(this.usersDTO);
    this.usersUpdDTOOnChanged = new BehaviorSubject(this.usersUpdDTO);
    this.usersSchemaOnChanged = new BehaviorSubject(this.usersSchema);
    this.usersByKeywordOnChanged = new BehaviorSubject(this.usersByKeyword);
    // Set the private defaults
    this._unsubscribeAll = new Subject();

 }

 ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
}

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
     resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any[]> | Promise<any[]> | any {
        return new Promise<any[]>((resolve) => {
                this.getUsersDTO();
                this.getUsersUpdDTO();
                this.getUsersSchema();
                resolve([]);
        });
    }

    /**
     * Get users DTO
     */
     getUsersDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userDTO
            );
            this._http.GetObs(httpConfig, true).subscribe((adUsersDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.usersDTO = adUsersDTO;
                this.usersDTOOnChanged.next(this.usersDTO);
                resolve(this.usersDTO);
            }, reject);
        });
    }


    /**
     * Get users Update DTO
     */
    getUsersUpdDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.updUserDTO
            );
            this._http.GetObs(httpConfig, true).subscribe((adUsersUpdDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.usersUpdDTO = adUsersUpdDTO;
                this.usersUpdDTOOnChanged.next(this.usersUpdDTO);
                resolve(this.usersUpdDTO);
            }, reject);
        });
    }

    /**
     * Get users schema
     */
    getUsersSchema(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userSchema
            );
            this._http.GetObs(httpConfig, true).subscribe((adUsersSchema: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.usersSchema = adUsersSchema;
                this.usersSchemaOnChanged.next(this.usersSchema);
                resolve(this.usersSchema);
            }, reject);
        });
    }

    exist(email: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.findUserByEmail,
                [email]
            );
            this._http.GetObs(httpConfig, true).subscribe((usersUpdDTOArray: any[]) => {
                this._authTokenSession.checkAuthTokenStatus();
                if (usersUpdDTOArray.length > 0) {
                    resolve(usersUpdDTOArray);
                } else {
                    reject();
                }
            }, reject);
        });

    }

    getBasicUserInfoByKeyword(keyword: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (this._fn.emptyStr(keyword)) {
                this.usersByKeyword = [];
                this.usersByKeywordOnChanged.next(this.usersByKeyword);
                resolve(this.usersByKeyword);
            }
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.basicUserByKeyword,
                [keyword]
            );
            this._http.GetObs(httpConfig, true).subscribe((usersByKeyword: any[]) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.usersByKeyword = usersByKeyword;
                this.usersByKeywordOnChanged.next(this.usersByKeyword);
                resolve(this.usersByKeyword);
            }, reject);
        });
    }

    getUserData(userId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userByUserId,
                [userId]
            );
            this._http.GetObs(httpConfig, true).subscribe((usersUpdDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                resolve(usersUpdDTO);
            }, reject);
        });
    }
}
