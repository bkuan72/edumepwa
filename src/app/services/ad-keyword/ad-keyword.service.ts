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
export class AdKeywordService implements Resolve<any[]>, OnDestroy {
    keywordCodes: string[];
    keywords: any[];
    keywordsDTO: any;
    keywordsUpdDTO: any;
    keywordsSchema: any;

    keywordsOnChanged: BehaviorSubject<any[]>;
    keywordCodesOnChanged: BehaviorSubject<string[]>;
    keywordsDTOOnChanged: BehaviorSubject<any[]>;
    keywordsUpdDTOOnChanged: BehaviorSubject<any[]>;
    keywordsSchemaOnChanged: BehaviorSubject<any[]>;
    _unsubscribeAll: Subject<any>;

constructor(
    private _http: SrvHttpService,
    private _authTokenSession: AuthTokenSessionService,
    private _alertService: AlertService
) {
    this.keywordCodes = [];
    this.keywords = [];
    this.keywordsOnChanged = new BehaviorSubject(this.keywords);
    this.keywordCodesOnChanged = new BehaviorSubject(this.keywordCodes);
    this.keywordsDTOOnChanged = new BehaviorSubject(this.keywordsDTO);
    this.keywordsUpdDTOOnChanged = new BehaviorSubject(this.keywordsUpdDTO);
    this.keywordsSchemaOnChanged = new BehaviorSubject(this.keywordsSchema);
    // Set the private defaults
    this._unsubscribeAll = new Subject();
 }

ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
}

doLoadKeywords(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const httpConfig = this._http.getSrvHttpConfig(
            SrvApiEnvEnum.adKeywords
        );
        this._http.GetObs(httpConfig, true).subscribe((adKeywords: any) => {
            this._authTokenSession.checkAuthTokenStatus();
            this.keywords = adKeywords;
            this.keywordsOnChanged.next(this.keywords);
            resolve(this.keywords);
        }, reject);
    });
}

doLoadKeywordCodes(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const httpConfig = this._http.getSrvHttpConfig(
            SrvApiEnvEnum.adKeywordCodes
        );
        this._http.GetObs(httpConfig, true).subscribe((adKeywordCodes: any) => {
            this._authTokenSession.checkAuthTokenStatus();
            this.keywordCodes = adKeywordCodes;
            this.keywordCodesOnChanged.next(this.keywordCodes);
            resolve(this.keywordCodes);
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
            this.doLoadKeywords().finally(() => {
                this.getKeywordsDTO();
                this.getKeywordsUpdDTO();
                this.getKeywordsSchema();
                resolve(this.keywords);
            });
        });
    }


    /**
     * Get keywords DTO
     */
    getKeywordsDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.adKeywordsDTO
            );
            this._http.GetObs(httpConfig, true).subscribe((adKeywordsDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.keywordsDTO = adKeywordsDTO;
                this.keywordsDTOOnChanged.next(this.keywordsDTO);
                resolve(this.keywordsDTO);
            }, reject);
        });
    }


    /**
     * Get keywords Update DTO
     */
    getKeywordsUpdDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.adKeywordsUpdDTO
            );
            this._http.GetObs(httpConfig, true).subscribe((adKeywordsUpdDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.keywordsUpdDTO = adKeywordsUpdDTO;
                this.keywordsUpdDTOOnChanged.next(this.keywordsUpdDTO);
                resolve(this.keywordsUpdDTO);
            }, reject);
        });
    }

    /**
     * Get keywords schema
     */
    getKeywordsSchema(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.adKeywordsSchema
            );
            this._http.GetObs(httpConfig, true).subscribe((adKeywordsSchema: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.keywordsSchema = adKeywordsSchema;
                this.keywordsSchemaOnChanged.next(this.keywordsSchema);
                resolve(this.keywordsSchema);
            }, reject);
        });
    }

    exist(keyword: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.findAdKeywordCode,
                [keyword]
            );
            this._http.GetObs(httpConfig, true).subscribe((adKeywordsUpdDTOArray: any[]) => {
                this._authTokenSession.checkAuthTokenStatus();
                if (adKeywordsUpdDTOArray.length > 0) {
                    resolve();
                } else {
                    reject();
                }
            }, reject);
        });

    }

    addKeyword(keyword: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.adKeywords,
                undefined,
                {adKeyword_code: keyword}
            );
            this._http.PostObs(httpConfig, true).subscribe((adKeywordsUpdDTOArray: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                if (adKeywordsUpdDTOArray) {
                    resolve();
                } else {
                    this._alertService.error('Error Adding Keyword Code');
                    reject();
                }
            }, reject);
        });

    }
    updateKeyword(id: string, keyword: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.patchAdKeywords,
                [id],
                {adKeyword_code: keyword}
            );
            this._http.PatchObs(httpConfig, true).subscribe((adKeywordsUpdDTOArray: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                if (adKeywordsUpdDTOArray) {
                    resolve();
                } else {
                    this._alertService.error('Error Adding Keyword Code');
                    reject();
                }
            }, reject);
        });

    }

    deleteKeyword(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.deleteAdKeywords,
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
