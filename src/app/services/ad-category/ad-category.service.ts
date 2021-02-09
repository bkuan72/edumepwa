import { isString } from 'lodash';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { SessionService } from './../session/session.service';
import { SrvHttpService } from './../http-connect/srv-http.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
import { SrvApiEnvEnum } from 'app/shared/SrvApiEnvEnum';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AdCategoryService implements Resolve<any[]>, OnDestroy {
    categories: any[];
    categoriesDTO: any;
    categoriesUpdDTO: any;
    categoriesSchema: any;

    categoriesOnChanged: BehaviorSubject<any[]>;
    categoriesDTOOnChanged: BehaviorSubject<any[]>;
    categoriesUpdDTOOnChanged: BehaviorSubject<any[]>;
    categoriesSchemaOnChanged: BehaviorSubject<any[]>;
    _unsubscribeAll: Subject<any>;

constructor(
    private _http: SrvHttpService,
    private _authTokenSession: AuthTokenSessionService,
    private _alertService: AlertService
) {
    this.categories = [];
    this.categoriesOnChanged = new BehaviorSubject(this.categories);
    this.categoriesDTOOnChanged = new BehaviorSubject(this.categoriesDTO);
    this.categoriesUpdDTOOnChanged = new BehaviorSubject(this.categoriesUpdDTO);
    this.categoriesSchemaOnChanged = new BehaviorSubject(this.categoriesSchema);
    // Set the private defaults
    this._unsubscribeAll = new Subject();
 }

ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
}

doLoadCategories(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const httpConfig = this._http.getSrvHttpConfig(
            SrvApiEnvEnum.adCategories
        );
        this._http.GetObs(httpConfig, true).subscribe((adCategories: any) => {
            this._authTokenSession.checkAuthTokenStatus();
            this.categories = adCategories;
            this.categoriesOnChanged.next(this.categories);
            resolve(this.categories);
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
            this.doLoadCategories().finally(() => {
                this.getCategoriesDTO();
                this.getCategoriesUpdDTO();
                this.getCategoriesSchema();
                resolve(this.categories);
            });
        });
    }


    /**
     * Get categories DTO
     */
    getCategoriesDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.adCategoriesDTO
            );
            this._http.GetObs(httpConfig, true).subscribe((adCategoriesDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.categoriesDTO = adCategoriesDTO;
                this.categoriesDTOOnChanged.next(this.categoriesDTO);
                resolve(this.categoriesDTO);
            }, reject);
        });
    }


    /**
     * Get categories Update DTO
     */
    getCategoriesUpdDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.adCategoriesUpdDTO
            );
            this._http.GetObs(httpConfig, true).subscribe((adCategoriesUpdDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.categoriesUpdDTO = adCategoriesUpdDTO;
                this.categoriesUpdDTOOnChanged.next(this.categoriesUpdDTO);
                resolve(this.categoriesUpdDTO);
            }, reject);
        });
    }

    /**
     * Get categories schema
     */
    getCategoriesSchema(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.adCategoriesSchema
            );
            this._http.GetObs(httpConfig, true).subscribe((adCategoriesSchema: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.categoriesSchema = adCategoriesSchema;
                this.categoriesSchemaOnChanged.next(this.categoriesSchema);
                resolve(this.categoriesSchema);
            }, reject);
        });
    }

    exist(category: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.findAdCategoryCode,
                [category]
            );
            this._http.GetObs(httpConfig, true).subscribe((adCategoriesUpdDTOArray: any[]) => {
                this._authTokenSession.checkAuthTokenStatus();
                if (adCategoriesUpdDTOArray.length > 0) {
                    resolve();
                } else {
                    reject();
                }
            }, reject);
        });

    }

    addCategory(category: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.adCategories,
                undefined,
                {adCategory_code: category}
            );
            this._http.PostObs(httpConfig, true).subscribe((adCategoriesUpdDTOArray: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                if (adCategoriesUpdDTOArray) {
                    resolve();
                } else {
                    this._alertService.error('Error Adding Category Code');
                    reject();
                }
            }, reject);
        });

    }
    updateCategory(id: string, category: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.patchAdCategories,
                [id],
                {adCategory_code: category}
            );
            this._http.PatchObs(httpConfig, true).subscribe((adCategoriesUpdDTOArray: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                if (adCategoriesUpdDTOArray) {
                    resolve();
                } else {
                    this._alertService.error('Error Adding Category Code');
                    reject();
                }
            }, reject);
        });

    }

    deleteCategory(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.deleteAdCategories,
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
