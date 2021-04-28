import { Injectable } from '@angular/core';
import { SrvApiEnvEnum } from 'app/shared/SrvApiEnvEnum';
import { AuthTokenSessionService } from '../auth-token-session/auth-token-session.service';
import { SrvHttpService } from '../http-connect/srv-http.service';

@Injectable({
    providedIn: 'root',
})
export class UserAccountGroupCacheService {
    users: any[];
    accounts: any[];
    groups: any[];
    constructor(
        private _http: SrvHttpService,
        private _authTokenSession: AuthTokenSessionService
    ) {
        this.users = [];
        this.accounts = [];
        this.groups = [];
    }

    updateUserAvatar(userId: string, avatar: string): void {
        this.users.some((user) => {
            if (user.id === userId) {
                user.avatar = avatar;
                return true;
            }
        });
    }

    updateAccountAvatar(accountId: string, avatar: string): void {
        this.accounts.some((account) => {
            if (account.id === accountId) {
                account.avatar = avatar;
                return true;
            }
        });
    }

    updateGroupAvatar(groupId: string, avatar: string): void {
        this.groups.some((group) => {
            if (group.id === groupId) {
                group.avatar = avatar;
                return true;
            }
        });
    }

    getUserFromCache(userId: string): any {
        let fr: any;
        this.users.some((user) => {
            if (user.id === userId) {
                fr = user;
                return true;
            }
        });
        return fr;
    }

    getAccountFromCache(accountId: string): any {
        let fr: any;
        this.accounts.some((account) => {
            if (account.id === accountId) {
                fr = account;
                return true;
            }
        });
        return fr;
    }

    getGroupFromCache(groupId: string): any {
        let fr: any;
        this.groups.some((group) => {
            if (group.id === groupId) {
                fr = group;
                return true;
            }
        });
        return fr;
    }

    /**
     * Get basic information for userId
     * @param userId - uuid of user
     */
    getBasicUserData(userId: string): Promise<any> {
        return new Promise((resolve) => {
            const fr = this.getUserFromCache(userId);

            if (fr === undefined) {
                this.getBasicUserDataFromServer(userId)
                    .then((userBasicData) => {
                        this.users.push(userBasicData);
                        resolve(userBasicData);
                    })
                    .catch(() => {
                        resolve({ id: '', name: '', avatar: '' });
                    });
            } else {
                resolve(fr);
            }
        });
    }

    /**
     * Get basic information for accountId
     * @param accountId - uuid of account
     */
    getBasicAccountData(accountId: string): Promise<any> {
        return new Promise((resolve) => {
            const fr = this.getAccountFromCache(accountId);

            if (fr === undefined) {
                this.getBasicAccountDataFromServer(accountId)
                    .then((accountBasicData) => {
                        this.accounts.push(accountBasicData);
                        resolve(accountBasicData);
                    })
                    .catch(() => {
                        resolve({ id: '', name: '', avatar: '' });
                    });
            } else {
                resolve(fr);
            }
        });
    }

    /**
     * Get basic information for accountId
     * @param accountId - uuid of account
     */
    getBasicGroupData(groupId: string): Promise<any> {
        return new Promise((resolve) => {
            const fr = this.getGroupFromCache(groupId);

            if (fr === undefined) {
                this.getBasicGroupDataFromServer(groupId)
                    .then((groupBasicData) => {
                        this.accounts.push(groupBasicData);
                        resolve(groupBasicData);
                    })
                    .catch(() => {
                        resolve({ id: '', name: '', avatar: '' });
                    });
            } else {
                resolve(fr);
            }
        });
    }

    /**
     * Get basic user data
     */
    getBasicUserDataFromServer(userId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.basicUserByUserId,
                [userId]
            );

            this._http
                .GetObs(httpConfig, true)
                .subscribe((userBasicData: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    resolve(userBasicData);
                }, reject);
        });
    }

    /**
     * Get basic account data
     */
    getBasicAccountDataFromServer(accountId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.basicAccountByAccountId,
                [accountId]
            );

            this._http
                .GetObs(httpConfig, true)
                .subscribe((accountBasicData: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    resolve(accountBasicData);
                }, reject);
        });
    }

    /**
     * Get basic group data
     */
    getBasicGroupDataFromServer(groupId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.basicGroupByGroupId,
                [groupId]
            );

            this._http
                .GetObs(httpConfig, true)
                .subscribe((groupBasicData: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    resolve(groupBasicData);
                }, reject);
        });
    }


    getAccountData(accountId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountById,
                [accountId]
            );
            this._http.GetObs(httpConfig, true).subscribe((accountUpdDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                resolve(accountUpdDTO);
            }, reject);
        });
    }

    getGroupData(groupId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.groupByGroupId,
                [groupId]
            );
            this._http.GetObs(httpConfig, true).subscribe((groupUpdDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                resolve(groupUpdDTO);
            }, reject);
        });
    }
}
