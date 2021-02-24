import { isString } from 'lodash';
import { SrvHttpService } from '../http-connect/srv-http.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
import { AlertService } from '../alert/alert.service';
import { AuthTokenSessionService } from '../auth-token-session/auth-token-session.service';
import { SrvApiEnvEnum } from '../../shared/SrvApiEnvEnum';

@Injectable({
    providedIn: 'root',
})
export class AccountsService implements OnDestroy {
    accounts: any[];
    accountsDTO: any;
    accountsUpdDTO: any;
    accountsSchema: any;

    accountsOnChanged: BehaviorSubject<any[]>;
    accountsDTOOnChanged: BehaviorSubject<any[]>;
    accountsUpdDTOOnChanged: BehaviorSubject<any[]>;
    accountsSchemaOnChanged: BehaviorSubject<any[]>;
    _unsubscribeAll: Subject<any>;

    constructor(
        private _http: SrvHttpService,
        private _authTokenSession: AuthTokenSessionService,
        private _alertService: AlertService
    ) {
        this.accounts = [];
        this.accountsOnChanged = new BehaviorSubject(this.accounts);
        this.accountsDTOOnChanged = new BehaviorSubject(this.accountsDTO);
        this.accountsUpdDTOOnChanged = new BehaviorSubject(this.accountsUpdDTO);
        this.accountsSchemaOnChanged = new BehaviorSubject(this.accountsSchema);
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


    /**
     * This function load the account list by user_id
     * @param userId 
     */
    doLoadAccounts(userId: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userAccountsByUserId,
                [userId]
            );
            this._http.GetObs(httpConfig, true).subscribe((accounts: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.accounts = accounts;
                this.accountsOnChanged.next(this.accounts);
                resolve(this.accounts);
            }, reject);
        });
    }

    /**
     * Get accounts DTO
     */
    getAccountsDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userAccountsDTO
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((accountsDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.accountsDTO = accountsDTO;
                    this.accountsDTOOnChanged.next(this.accountsDTO);
                    resolve(this.accountsDTO);
                }, reject);
        });
    }

    /**
     * Get accounts Update DTO
     */
    getAccountsUpdDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountsUpdDTO
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((accountsUpdDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.accountsUpdDTO = accountsUpdDTO;
                    this.accountsUpdDTOOnChanged.next(this.accountsUpdDTO);
                    resolve(this.accountsUpdDTO);
                }, reject);
        });
    }

    /**
     * Get accounts schema
     */
    getAccountsSchema(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountsSchema
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((accountsSchema: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.accountsSchema = accountsSchema;
                    this.accountsSchemaOnChanged.next(this.accountsSchema);
                    resolve(this.accountsSchema);
                }, reject);
        });
    }

    exist(account: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.findAccountCode,
                [account]
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((accountsUpdDTOArray: any[]) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    if (accountsUpdDTOArray.length > 0) {
                        resolve();
                    } else {
                        reject();
                    }
                }, reject);
        });
    }

    addAccount(account: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accounts,
                undefined,
                { account_code: account }
            );
            this._http
                .PostObs(httpConfig, true)
                .subscribe((accountsUpdDTOArray: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    if (accountsUpdDTOArray) {
                        resolve();
                    } else {
                        this._alertService.error('Error Adding Account Code');
                        reject();
                    }
                }, reject);
        });
    }
    updateAccount(id: string, account: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.patchAccounts,
                [id],
                { account_code: account }
            );
            this._http
                .PatchObs(httpConfig, true)
                .subscribe((accountsUpdDTOArray: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    if (accountsUpdDTOArray) {
                        resolve();
                    } else {
                        this._alertService.error('Error Adding Account Code');
                        reject();
                    }
                }, reject);
        });
    }
}
