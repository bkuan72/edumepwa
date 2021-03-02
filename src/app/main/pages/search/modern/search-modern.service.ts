import { SrvApiEnvEnum } from './../../../../shared/SrvApiEnvEnum';
import { SrvHttpService } from 'app/services/http-connect/srv-http.service';
import { Injectable, OnInit, Pipe } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';

@Injectable()
export class SearchModernService implements Resolve<any>
{
    data: any;
    dataOnChanged: BehaviorSubject<any>;
    filterDTO: any;
    filterDTOOnChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _http: SrvHttpService,
        private router: Router,
        private _authTokenSession: AuthTokenSessionService,
    )
    {
        // Set the defaults
        this.dataOnChanged = new BehaviorSubject({});
        this.filterDTOOnChanged = new BehaviorSubject(this.filterDTO);
    }

    getFilterDTO(): Promise<void> {
        return new Promise((resolve) => {
            if (this._authTokenSession.devUser) {
            const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.advertisementsFilterDTO);
            this._http.GetObs(httpConfig, true)
                .subscribe((data: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.filterDTO = data;
                    this.filterDTOOnChanged.next(this.filterDTO);
                    resolve();
                    }, () => {
                        resolve();
                    });
            } else {
                resolve();
            }
        });
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
        return new Promise<void>((resolve, reject) => {
            Promise.all([
                this.getSearchData(''),
                this.getFilterDTO()
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
                [searchStr],
                );
        }
        this._http.GetObs(httpConfig, true)
            .subscribe((data: any) => {
                this._authTokenSession.checkAuthTokenStatus();

                this.data = data;
                this.dataOnChanged.next(this.data);
                resolve(this.data);
                }, () => {
                    this.router.navigateByUrl('maintenance');
                    resolve([]);
                });
    });
    }
}
