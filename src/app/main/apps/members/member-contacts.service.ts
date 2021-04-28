import { MatDialog } from '@angular/material/dialog';
import { SrvHttpService } from 'app/services/http-connect/srv-http.service';
import { Injectable, OnDestroy } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { MemberContact } from 'app/main/apps/members/member-contact.model';
import { takeUntil } from 'rxjs/operators';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { SrvApiEnvEnum } from 'app/shared/SrvApiEnvEnum';
import { CommonFn } from 'app/shared/common-fn';
import { AccountsService } from 'app/services/account/account.service';
import { AccountProfileService } from 'app/main/pages/account-profile/account-profile.service';
import { UserAccountGroupCacheService } from 'app/services/user-account-group-cache/user-account-group-cache.service';

@Injectable()
export class MemberContactsService implements Resolve<any>, OnDestroy {
    onMemberContactsChanged: BehaviorSubject<any>;
    onSelectedMemberContactsChanged: BehaviorSubject<any>;
    onAccountDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    contacts: MemberContact[];
    account: any;
    selectedMemberContacts: string[] = [];

    memberDTO: any;
    updMemberDTO: any;
    accountGroupMembersSchema: any;

    memberDTOOnChanged: BehaviorSubject<any>;
    updMemberDTOOnChanged: BehaviorSubject<any>;
    accountGroupMembersSchemaOnChanged: BehaviorSubject<any>;

    searchText: string;
    filterBy: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {SrvHttpService} _http
     */
    constructor(
        private _http: SrvHttpService,
        private _authTokenSession: AuthTokenSessionService,
        private _matDialog: MatDialog,
        private _accountService: AccountProfileService,
        private _userAccountGroupCache: UserAccountGroupCacheService,
        private _fn: CommonFn
    ) {
        this.account = this._accountService.account;

        // Set the defaults
        this.onMemberContactsChanged = new BehaviorSubject([]);
        this.onSelectedMemberContactsChanged = new BehaviorSubject([]);
        this.onAccountDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();

        this.memberDTOOnChanged = new BehaviorSubject(this.memberDTO);
        this.updMemberDTOOnChanged = new BehaviorSubject(this.updMemberDTO);
        this.accountGroupMembersSchemaOnChanged = new BehaviorSubject(this.accountGroupMembersSchema);

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this._accountService.accountOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((account) => {
                this.account = account;
                if (this.account) {
                    this.getMemberContacts();
                }
                this.onAccountDataChanged.next(this.account);
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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
    ): Observable<void> | Promise<void> | void {
        return new Promise((resolve, reject) => {
            if (!this._authTokenSession.isLoggedIn()) {
                reject();
                return;
            }
            if (this.account) {
                this.checkBlockByAccount(this.account.id, this._authTokenSession.currentAuthUser.id).then((resp) => {
                    if (resp.blocked) {
                        reject();
                        return;
                    }
                    Promise.all([
                        this.getMemberContacts(),
                        this.getMemberDTO(),
                        this.getUpdMemberDTO(),
                        this.getMemberSchema()
                    ]).then(() => {
                        this.onSearchTextChanged.subscribe((searchText) => {
                            this.searchText = searchText;
                            this.getMemberContacts();
                        });
                        this.onFilterChanged.subscribe((filter) => {
                            this.filterBy = filter;
                            this.getMemberContacts();
                        });
                        resolve();
                    }, reject);
                })
                .catch(() => {
                    reject();
                });
            } else {
                reject();
            }
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }



    /**
     * Get member DTO
     */
     getMemberDTO(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this._authTokenSession.devUser) {
                const httpConfig = this._http.getSrvHttpConfig(
                    SrvApiEnvEnum.memberDTO
                );
                this._http.GetObs(httpConfig, true).subscribe((memberDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.memberDTO = memberDTO;
                    this.memberDTOOnChanged.next(this.memberDTO);
                    resolve(this.memberDTO);
                }, reject);
            } else {
                resolve();
            }

        });
    }
    /**
     * Get update member DTO
     */
    getUpdMemberDTO(): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.updMemberDTO
            );
            this._http.GetObs(httpConfig, true).subscribe((updMemberDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.updMemberDTO = updMemberDTO;
                this.updMemberDTOOnChanged.next(this.updMemberDTO);
                resolve(this.updMemberDTO);
            }, reject);
        });
    }
    /**
     * Get member schema
     */
    getMemberSchema(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this._authTokenSession.devUser) {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountGroupMembersSchema
            );
            this._http.GetObs(httpConfig, true).subscribe((accountGroupMembersSchema: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.accountGroupMembersSchema = accountGroupMembersSchema;
                this.accountGroupMembersSchemaOnChanged.next(this.accountGroupMembersSchema);
                resolve(this.accountGroupMembersSchema);
            }, reject);
            } else {
                resolve();
            }
        });
    }

    
    /**
     * populate activity users with user data
     */
     doPopulateUserFromCache(): Promise<void> {
        const doGetBasicContactInfo = (idx: number, res: (value: void | PromiseLike<void>) => void) => {
            if (this.contacts.length === 0) {
                res();
                return;
            }
            const contact = this.contacts[idx];
            if (!this._fn.isZeroUuid(contact.user_id)) {
                this._userAccountGroupCache.getBasicUserData(contact.user_id).then((user) => {
                    if (user) {
                        contact.avatar = user.avatar;
                        if (this._fn.emptyStr(contact.first_name)) {
                            contact.first_name = user.first_name;
                            contact.last_name = user.last_name;
                        }
                    }
                    if (idx + 1 >= this.contacts.length) {
                        res();
                    } else {
                        doGetBasicContactInfo(idx + 1, res);
                    }
                });
            } else {
                if (idx + 1 >= this.contacts.length) {
                    res();
                } else {
                    doGetBasicContactInfo(idx + 1, res);
                }
            }
        };
        return new Promise((resolve) => {
            doGetBasicContactInfo(0, resolve);
        });
    }

    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    getMemberContacts(): Promise<any> {
        return new Promise((resolve, reject) => {
        if (!this._authTokenSession.isLoggedIn()) {
            reject();
            return;
        }
        const httpConfig = this._http.getSrvHttpConfig(
            SrvApiEnvEnum.accountMembers,
            [this.account.id]
        );
        this._http
            .GetObs(httpConfig, true)
            .subscribe((contacts: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.contacts = contacts;

                if (this.filterBy === 'starred') {
                    this.contacts = this.contacts.filter((_contact) => {
                        return _contact.starred;
                    });
                }

                if (this.filterBy === 'frequent') {
                    this.contacts = this.contacts.filter((_contact) => {
                        return _contact.frequent > 5;
                    });
                }

                if (this.filterBy === 'blocked') {
                    this.contacts = this.contacts.filter((_contact) => {
                        return _contact.member_status === 'BLOCKED';
                    });
                }

                if (this.searchText && this.searchText !== '') {
                    this.contacts = FuseUtils.filterArrayByString(
                        this.contacts,
                        this.searchText
                    );
                }

                this.contacts = this.contacts.map((contact) => {
                    return new MemberContact(contact);
                });
                this.doPopulateUserFromCache().finally(() => {
                    this.onMemberContactsChanged.next(this.contacts);
                    resolve(this.contacts);
                });
            }, reject);
        });
    }


    /**
     * Toggle selected contact by id
     *
     * @param id
     */
    toggleSelectedContact(id): void {
        // First, check if we already have that contact as selected...
        if (this.selectedMemberContacts.length > 0) {
            const index = this.selectedMemberContacts.indexOf(id);

            if (index !== -1) {
                this.selectedMemberContacts.splice(index, 1);

                // Trigger the next event
                this.onSelectedMemberContactsChanged.next(this.selectedMemberContacts);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedMemberContacts.push(id);

        // Trigger the next event
        this.onSelectedMemberContactsChanged.next(this.selectedMemberContacts);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedMemberContacts.length > 0) {
            this.deselectMemberContacts();
        } else {
            this.selectMemberContacts();
        }
    }

    /**
     * Select contacts
     *
     * @param filterParameter
     * @param filterValue
     */
    selectMemberContacts(filterParameter?, filterValue?): void {
        this.selectedMemberContacts = [];

        // If there is no filter, select all contacts
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedMemberContacts = [];
            this.contacts.map((contact) => {
                this.selectedMemberContacts.push(contact.id);
            });
        }

        // Trigger the next event
        this.onSelectedMemberContactsChanged.next(this.selectedMemberContacts);
    }

    /**
     * Update contact
     *
     * @param contact
     * @returns {Promise<any>}
     */
    updateContact(contact): Promise<void> {
        return new Promise((resolve, reject) => {

            if (this._fn.emptyStr(contact.id)) {
                if (contact.blockUser) {
                    contact.member_status = 'BLOCKED';
                }
                contact.member_date = this._fn.getNowISODate();
                const newContact = this._fn.mapObj(contact, contact, ['id', 'blockUser']);
                const httpConfig = this._http.getSrvHttpConfig(
                    SrvApiEnvEnum.accountGroupMembers,
                    undefined,
                    newContact
                );
                this._fn.defineProperty(contact, 'member_date', '');

                this._http.PostObs(httpConfig, true).subscribe((newUser: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.getMemberContacts();
                    resolve();
                }, reject);
            } else {
                let origContact = {};
                if (contact.blockUser) {
                    contact.member_status = 'BLOCKED';
                }
                this.contacts.some((ct) => {
                    if (ct.id === contact.id) {
                        origContact = ct;
                        return true;
                    }

                });
                const updContact = this._fn.mapObjChangedPropertyValue(origContact, contact, ['blockUser']);
                const httpConfig = this._http.getSrvHttpConfig(
                    SrvApiEnvEnum.accountMemberContactsUpdate,
                    [contact.id],
                    updContact
                );
                this._http.PatchObs(httpConfig, true).subscribe((newUser: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.getMemberContacts();
                    resolve();
                }, reject);
            }
        });
    }

    /**
     * Update user data
     *
     * @param userData
     * @returns {Promise<any>}
     */
    updateContactStar(contactId): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.toggleMemberContactStar,
                [contactId]
            );
            this._http.PatchObs(httpConfig, true).subscribe((newUser: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.getMemberContacts();
                resolve();
            }, reject);
        });
    }


    /**
     * Update user data
     *
     * @param userData
     * @returns {Promise<any>}
     */
    updateContactMemberStatusOk(contactId): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountMemberContactsUpdate,
                [contactId],
                {
                    member_status: 'OK'
                }
            );
            this._http.PatchObs(httpConfig, true).subscribe((newUser: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.getMemberContacts();
                resolve();
            }, reject);
        });
    }

    /**
     * Deselect contacts
     */
    deselectMemberContacts(): void {
        const deleteSelected = (idx: number) => {
            if (idx >= this.selectedMemberContacts.length) {
                this.getMemberContacts().then(() => {
                    this.selectedMemberContacts = [];
                    // Trigger the next event
                    this.onSelectedMemberContactsChanged.next(this.selectedMemberContacts);
                });
                return;
            }
            const contactId = this.selectedMemberContacts[idx];
            this.deleteContact(contactId).finally(() => {
                deleteSelected(idx + 1);
            });
        }
        if (this.selectedMemberContacts.length > 0) {
            deleteSelected(0);
        }
    }

    /**
     * Delete contact
     *
     * @param contact
     */
    deleteContact(contactId): Promise<void> {
        return new Promise((resolve) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.removeMemberContact,
                [contactId]
            );
            this._http.PatchObs(httpConfig, true).subscribe((newUser: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.getMemberContacts();
                resolve();
            }, resolve);
        });
    }

    /**
     * Delete selected contacts
     */
    deleteSelectedMemberContacts(): void {
        for (const contactId of this.selectedMemberContacts) {
            const contact = this.contacts.find((_contact) => {
                return _contact.id === contactId;
            });
            const contactIndex = this.contacts.indexOf(contact);
            this.contacts.splice(contactIndex, 1);
        }
        this.onMemberContactsChanged.next(this.contacts);
        this.deselectMemberContacts();
    }

    /**
     * Check if user.id is in already in contact list
     * @param userId - users.id
     * @returns 
     */
    inContact(userId: string): boolean {
        let isContact = false;
        this.contacts.some((contact) => {
            if (contact.user_id === userId) {
                isContact = true;
                return true;
            }
        });
        return isContact;
    }

    /**
     * Check if user have blocked current login user
     * @param userId - link users
     * @returns 
     */
    checkBlockByAccount(accountId: string, userId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.blockedByAccount,
                [
                    accountId,
                    userId,
                ]
            );
            this._http.GetObs(httpConfig, true).subscribe((resp: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                resolve(resp);
            }, reject);
        });
    }

    /**
     * Check if group have blocked current login user
     * @param userId - link users
     * @returns 
     */
     checkBlockByGroup(groupId: string, userId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.blockedByGroup,
                [
                    groupId,
                    userId,
                ]
            );
            this._http.GetObs(httpConfig, true).subscribe((resp: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                resolve(resp);
            }, reject);
        });
    }

    /**
     * Check if account have blocked current login user
     * @param userId - link users
     * @returns 
     */
    checkAccountBlockByUser(accountId: string, userId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountBlockByUser,
                [
                    userId,
                    accountId
                ]
            );
            this._http.GetObs(httpConfig, true).subscribe((resp: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                resolve(resp);
            }, reject);
        });
    }

    /**
     * Check if group have blocked current login user
     * @param userId - link users
     * @returns 
     */
    checkGroupBlockByUser(accountId: string, userId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.groupBlockByUser,
                [
                    userId,
                    accountId
                ]
            );
            this._http.GetObs(httpConfig, true).subscribe((resp: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                resolve(resp);
            }, reject);
        });
    }

}
