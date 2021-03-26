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
export class AccountsService implements OnDestroy, Resolve<any> {
    account: any;       // currently active account
    accounts: any[];    // list of account own by user
    userAccountsDTO: any;
    userAccountsUpdDTO: any;
    userAccountsSchema: any;
    userAccountsDataDTO: any;

    accountsDTO: any;
    accountsUpdDTO: any;
    accountsSchema: any;

    accountOnChanged: BehaviorSubject<any>;
    accountsOnChanged: BehaviorSubject<any[]>;

    userAccountsDTOOnChanged: BehaviorSubject<any[]>;
    userAccountsUpdDTOOnChanged: BehaviorSubject<any[]>;
    userAccountsSchemaOnChanged: BehaviorSubject<any[]>;

    userAccountsDataDTOOnChanged: BehaviorSubject<any[]>;

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
        this.accountOnChanged = new BehaviorSubject(this.account);
        this.accountsOnChanged = new BehaviorSubject(this.accounts);

        this.userAccountsDTOOnChanged = new BehaviorSubject(this.userAccountsDTO);
        this.userAccountsUpdDTOOnChanged = new BehaviorSubject(this.userAccountsUpdDTO);
        this.userAccountsSchemaOnChanged = new BehaviorSubject(this.userAccountsSchema);

        this.userAccountsDataDTOOnChanged = new BehaviorSubject(this.userAccountsDataDTO);

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

    checkAccountLoaded(): Observable<any> | Promise<any> | any {
        return new Promise<void>((resolve, reject) => {
            if (this.account !== undefined) {
                resolve();
            } else {
                reject();
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
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return this.checkAccountLoaded();
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


    initNewAccount(userId: string): Promise<void> {
        return new Promise<void>((resolve) => {
            this.getAccountsDTO().then((newAccount) => {
                this.account = newAccount;
                this.accountOnChanged.next(this.account);
                resolve();
            })
        });
    }

    /**
     * Get account by ID
     */
    getAccountById(accountId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountById,
                [accountId]
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((account: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.account = account;
                    this.accountOnChanged.next(this.account);
                    resolve(this.account);
                }, reject);
        });
    }

    /**
     * Get user accounts accounts DTO
     */
    getUserAccountsDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userAccountsDTO
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((userAccountsDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.userAccountsDTO = userAccountsDTO;
                    this.userAccountsDTOOnChanged.next(this.userAccountsDTO);
                    resolve(this.userAccountsDTO);
                }, reject);
        });
    }


    /**
     * Get user accounts Update DTO
     */
    getUserAccountsUpdDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userAccountsUpdDTO
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((userAccountsUpdDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.userAccountsUpdDTO = userAccountsUpdDTO;
                    this.userAccountsUpdDTOOnChanged.next(this.userAccountsUpdDTO);
                    resolve(this.userAccountsUpdDTO);
                }, reject);
        });
    }

    /**
     * Get accounts schema
     */
    getUserAccountsSchema(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userAccountsSchema
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((userAccountsSchema: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.userAccountsSchema = userAccountsSchema;
                    this.userAccountsSchemaOnChanged.next(this.userAccountsSchema);
                    resolve(this.userAccountsSchema);
                }, reject);
        });
    }


    /**
     * Get user account data DTO
     */
    getUserAccountsDataDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userAccountsDataDTO
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((userAccountsDataDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.userAccountsDataDTO = userAccountsDataDTO;
                    this.userAccountsDataDTOOnChanged.next(this.userAccountsDataDTO);
                    resolve(this.userAccountsDataDTO);
                }, reject);
        });
    }

    /**
     * Get accounts DTO
     */
    getAccountsDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountsDTO
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


    createUserAccountHolder(userId: string, accountId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const userAccount = {
                user_id: userId,
                account_id: accountId,
                acc_type: "HOLDER",
            }
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userAccounts,
                undefined,
                userAccount
            );
            this._http
                .PostObs(httpConfig, true)
                .subscribe((accountDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    if (accountDTO) {
                        resolve();
                    } else {
                        this._alertService.error('Error Adding Account Code');
                        reject();
                    }
                }, reject);
        });
    }

    addServiceAccount(userId: string, account: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.newServiceAccount,
                undefined,
                account
            );
            this._http
                .PostObs(httpConfig, true)
                .subscribe((accountDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    if (accountDTO) {
                        this.createUserAccountHolder(userId, accountDTO.id).then (() => {
                            resolve();
                        }).catch(() => {
                            this._alertService.error('Error Adding Account Code');
                            reject();
                        });
                    } else {
                        this._alertService.error('Error Adding Account Code');
                        reject();
                    }
                }, reject);
        });
    }

    addNormalAccount(userId: string, account: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.newNormalAccount,
                undefined,
                account
            );
            this._http
                .PostObs(httpConfig, true)
                .subscribe((accountDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    if (accountDTO) {
                        this.createUserAccountHolder(userId, accountDTO.id).then (() => {
                            resolve();
                        }).catch(() => {
                            this._alertService.error('Error Adding Account Code');
                            reject();
                        });
                    } else {
                        this._alertService.error('Error Adding Account Code');
                        reject();
                    }
                }, reject);
        });
    }

    updateAccount(id: string, account: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.patchAccounts,
                [id],
                account
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


    
    /**
     * Update User Profile Avatar
     */
    updateAccountAvatar(accountId: string, avatar: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.updateAccountAvatar,
                [accountId],
                {
                    avatar: avatar
                }
            );
            this._http.Put(httpConfig, true).then(() => {
                this._authTokenSession.checkAuthTokenStatus();
                this.getAccountById(accountId);
                resolve();
            })
            .catch(() => {
                reject();
            });
        });
    }

}
