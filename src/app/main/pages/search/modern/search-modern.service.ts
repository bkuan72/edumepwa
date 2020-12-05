import { CommonFn } from './../../../../shared/common-fn';
import { SrvApiEnvEnum } from './../../../../shared/SrvApiEnvEnum';
import { SrvHttpService } from 'app/services/http-connect/srv-http.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SearchModernService implements Resolve<any>
{
    data: any;
    dataOnChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _http: SrvHttpService
    )
    {
        // Set the defaults
        this.dataOnChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getSearchData('')
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get search data
     */
    getSearchData(searchStr: string): Promise<any[]>
    {
        return new Promise((resolve, reject) => {
        let httpConfig: any;
        if (searchStr.length === 0) {
            httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.advertisements
                );
        } else {
            httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.advertisementSearch,
                searchStr,
                );
        }
        this._http.GetObs(httpConfig, true)
            .subscribe((data: any) => {
                this.data = data;
                this.dataOnChanged.next(this.data);
                resolve(this.data);
                }, reject);
    });
    }
}
