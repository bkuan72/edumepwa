import { SrvApiEnvEnum } from './../../shared/SrvApiEnvEnum';
import { AuthTokenSessionService } from './../auth-token-session/auth-token-session.service';
import { isString } from 'lodash';
import { SrvHttpService } from './../http-connect/srv-http.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AdAgeGroupService implements Resolve<any[]>, OnDestroy {
    ageGroups: any[];
    ageGroupsDTO: any;
    ageGroupsUpdDTO: any;
    ageGroupsSchema: any;

    ageGroupsOnChanged: BehaviorSubject<any[]>;
    ageGroupsDTOOnChanged: BehaviorSubject<any[]>;
    ageGroupsUpdDTOOnChanged: BehaviorSubject<any[]>;
    ageGroupsSchemaOnChanged: BehaviorSubject<any[]>;
    _unsubscribeAll: Subject<any>;

constructor(
    private _http: SrvHttpService,
    private _authTokenSession: AuthTokenSessionService,
    private _alertService: AlertService
) {
    this.ageGroups = [];
    this.ageGroupsOnChanged = new BehaviorSubject(this.ageGroups);
    this.ageGroupsDTOOnChanged = new BehaviorSubject(this.ageGroupsDTO);
    this.ageGroupsUpdDTOOnChanged = new BehaviorSubject(this.ageGroupsUpdDTO);
    this.ageGroupsSchemaOnChanged = new BehaviorSubject(this.ageGroupsSchema);
    // Set the private defaults
    this._unsubscribeAll = new Subject();
 }

ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
}

doLoadAgeGroups(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const httpConfig = this._http.getSrvHttpConfig(
            SrvApiEnvEnum.adAgeGroups
        );
        this._http.GetObs(httpConfig, true).subscribe((adAgeGroups: any) => {
            this._authTokenSession.checkAuthTokenStatus();
            this.ageGroups = adAgeGroups;
            this.ageGroupsOnChanged.next(this.ageGroups);
            resolve(this.ageGroups);
        }, reject);
    });
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
    ): Observable<any[]> | Promise<any[]> | any[] {
        return new Promise<any[]>((resolve) => {
            this.doLoadAgeGroups().finally(() => {
                this.getAgeGroupsDTO();
                this.getAgeGroupsUpdDTO();
                this.getAgeGroupsSchema();
                resolve(this.ageGroups);
            });
        });
    }


    /**
     * Get ageGroups DTO
     */
    getAgeGroupsDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.adAgeGroupsDTO
            );
            this._http.GetObs(httpConfig, true).subscribe((adAgeGroupsDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.ageGroupsDTO = adAgeGroupsDTO;
                this.ageGroupsDTOOnChanged.next(this.ageGroupsDTO);
                resolve(this.ageGroupsDTO);
            }, reject);
        });
    }


    /**
     * Get ageGroups Update DTO
     */
    getAgeGroupsUpdDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.adAgeGroupsUpdDTO
            );
            this._http.GetObs(httpConfig, true).subscribe((adAgeGroupsUpdDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.ageGroupsUpdDTO = adAgeGroupsUpdDTO;
                this.ageGroupsUpdDTOOnChanged.next(this.ageGroupsUpdDTO);
                resolve(this.ageGroupsUpdDTO);
            }, reject);
        });
    }

    /**
     * Get ageGroups schema
     */
    getAgeGroupsSchema(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.adAgeGroupsSchema
            );
            this._http.GetObs(httpConfig, true).subscribe((adAgeGroupsSchema: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.ageGroupsSchema = adAgeGroupsSchema;
                this.ageGroupsSchemaOnChanged.next(this.ageGroupsSchema);
                resolve(this.ageGroupsSchema);
            }, reject);
        });
    }

    exist(ageGroup: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.findAdAgeGroupCode,
                [ageGroup]
            );
            this._http.GetObs(httpConfig, true).subscribe((adAgeGroupsUpdDTOArray: any[]) => {
                this._authTokenSession.checkAuthTokenStatus();
                if (adAgeGroupsUpdDTOArray.length > 0) {
                    resolve();
                } else {
                    reject();
                }
            }, reject);
        });

    }

    addAgeGroup(ageGroupDTO: {
        adAgeGroup_code: string,
        start_age: number,
        end_age: number
    }): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.adAgeGroups,
                undefined,
                ageGroupDTO
            );
            this._http.PostObs(httpConfig, true).subscribe((adAgeGroupsUpdDTOArray: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                if (adAgeGroupsUpdDTOArray) {
                    resolve();
                } else {
                    this._alertService.error('Error Adding AgeGroup Code');
                    reject();
                }
            }, reject);
        });

    }
    updateAgeGroup(id: string, ageGroup: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.patchAdAgeGroups,
                [id],
                {adAgeGroup_code: ageGroup}
            );
            this._http.PatchObs(httpConfig, true).subscribe((adAgeGroupsUpdDTOArray: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                if (adAgeGroupsUpdDTOArray) {
                    resolve();
                } else {
                    this._alertService.error('Error Adding AgeGroup Code');
                    reject();
                }
            }, reject);
        });

    }

    deleteAgeGroup(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.deleteAdAgeGroups,
                [id]
            );
            this._http.Put(httpConfig, true).then((res) => {
                this._authTokenSession.checkAuthTokenStatus();
                if (!isString(res)) {
                    resolve();
                } else {
                    this._alertService.error(res);
                    reject();
                }
            }, reject);
        });

    }
}
