import { MatDialog } from '@angular/material/dialog';
import { UserService } from './../../../services/user/user.service';
import { SrvHttpService } from 'app/services/http-connect/srv-http.service';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Contact } from 'app/main/apps/contacts/contact.model';
import { takeUntil } from 'rxjs/operators';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { SrvApiEnvEnum } from 'app/shared/SrvApiEnvEnum';
import { fn } from '@angular/compiler/src/output/output_ast';
import { CommonFn } from 'app/shared/common-fn';

@Injectable()
export class ContactsService implements Resolve<any>, OnDestroy {
    onContactsChanged: BehaviorSubject<any>;
    onSelectedContactsChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    contacts: Contact[];
    user: any;
    selectedContacts: string[] = [];

    friendDTO: any;
    updFriendDTO: any;
    friendsSchema: any;

    friendDTOOnChanged: BehaviorSubject<any>;
    updFriendDTOOnChanged: BehaviorSubject<any>;
    friendsSchemaOnChanged: BehaviorSubject<any>;

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
        private _fn: CommonFn
    ) {
        this.user = this._authTokenSession.currentAuthUser;
        // Set the defaults
        this.onContactsChanged = new BehaviorSubject([]);
        this.onSelectedContactsChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();

        this.friendDTOOnChanged = new BehaviorSubject(this.friendDTO);
        this.updFriendDTOOnChanged = new BehaviorSubject(this.updFriendDTO);
        this.friendsSchemaOnChanged = new BehaviorSubject(this.friendsSchema);

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this._authTokenSession.authUserOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user) => {
                this.user = user;
                if (this.user) {
                    this.getContacts();
                }
                this.onUserDataChanged.next(this.user);
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
            if (this.user) {
                this.checkBlockByFriend(this.user.id).then((resp) => {
                    if (resp.blocked) {
                        reject();
                        return;
                    }
                    Promise.all([
                        this.getContacts(),
                        this.getFriendDTO(),
                        this.getUpdFriendDTO(),
                        this.getFriendSchema()
                    ]).then(() => {
                        this.onSearchTextChanged.subscribe((searchText) => {
                            this.searchText = searchText;
                            this.getContacts();
                        });
                        this.onFilterChanged.subscribe((filter) => {
                            this.filterBy = filter;
                            this.getContacts();
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
     * Get friend DTO
     */
     getFriendDTO(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this._authTokenSession.devUser) {
                const httpConfig = this._http.getSrvHttpConfig(
                    SrvApiEnvEnum.friendDTO
                );
                this._http.GetObs(httpConfig, true).subscribe((friendDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.friendDTO = friendDTO;
                    this.friendDTOOnChanged.next(this.friendDTO);
                    resolve(this.friendDTO);
                }, reject);
            } else {
                resolve();
            }

        });
    }
    /**
     * Get update friend DTO
     */
    getUpdFriendDTO(): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.updFriendDTO
            );
            this._http.GetObs(httpConfig, true).subscribe((updFriendDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.updFriendDTO = updFriendDTO;
                this.updFriendDTOOnChanged.next(this.updFriendDTO);
                resolve(this.updFriendDTO);
            }, reject);
        });
    }
    /**
     * Get friend schema
     */
    getFriendSchema(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this._authTokenSession.devUser) {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.friendsSchema
            );
            this._http.GetObs(httpConfig, true).subscribe((friendsSchema: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.friendsSchema = friendsSchema;
                this.friendsSchemaOnChanged.next(this.friendsSchema);
                resolve(this.friendsSchema);
            }, reject);
            } else {
                resolve();
            }
        });
    }

    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    getContacts(): Promise<any> {
        return new Promise((resolve, reject) => {
        if (!this._authTokenSession.isLoggedIn()) {
            reject();
            return;
        }
        const httpConfig = this._http.getSrvHttpConfig(
            SrvApiEnvEnum.userContactsByUserId,
            [this.user.id]
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
                        return _contact.friend_status === 'BLOCKED';
                    });
                }

                if (this.searchText && this.searchText !== '') {
                    this.contacts = FuseUtils.filterArrayByString(
                        this.contacts,
                        this.searchText
                    );
                }

                this.contacts = this.contacts.map((contact) => {
                    return new Contact(contact);
                });

                this.onContactsChanged.next(this.contacts);
                resolve(this.contacts);
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
        if (this.selectedContacts.length > 0) {
            const index = this.selectedContacts.indexOf(id);

            if (index !== -1) {
                this.selectedContacts.splice(index, 1);

                // Trigger the next event
                this.onSelectedContactsChanged.next(this.selectedContacts);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedContacts.push(id);

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedContacts.length > 0) {
            this.deselectContacts();
        } else {
            this.selectContacts();
        }
    }

    /**
     * Select contacts
     *
     * @param filterParameter
     * @param filterValue
     */
    selectContacts(filterParameter?, filterValue?): void {
        this.selectedContacts = [];

        // If there is no filter, select all contacts
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedContacts = [];
            this.contacts.map((contact) => {
                this.selectedContacts.push(contact.id);
            });
        }

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
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
                    contact.friend_status = 'BLOCKED';
                }
                contact.friend_date = this._fn.getNowISODate();
                const newContact = this._fn.mapObj(contact, contact, ['id', 'blockUser']);
                const httpConfig = this._http.getSrvHttpConfig(
                    SrvApiEnvEnum.userContactsUpdate,
                    undefined,
                    newContact
                );
                this._fn.defineProperty(contact, 'friend_date', '');

                this._http.PostObs(httpConfig, true).subscribe((newUser: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.getContacts();
                    resolve();
                }, reject);
            } else {
                let origContact = {};
                if (contact.blockUser) {
                    contact.friend_status = 'BLOCKED';
                }
                this.contacts.some((ct) => {
                    if (ct.id === contact.id) {
                        origContact = ct;
                        return true;
                    }

                });
                const updContact = this._fn.mapObjChangedPropertyValue(origContact, contact, ['blockUser']);
                const httpConfig = this._http.getSrvHttpConfig(
                    SrvApiEnvEnum.userContactsUpdate,
                    [contact.id],
                    updContact
                );
                this._http.PatchObs(httpConfig, true).subscribe((newUser: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.getContacts();
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
                SrvApiEnvEnum.toggleContactStar,
                [contactId]
            );
            this._http.PatchObs(httpConfig, true).subscribe((newUser: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.getContacts();
                resolve();
            }, reject);
        });
    }

    /**
     * Deselect contacts
     */
    deselectContacts(): void {
        const deleteSelected = (idx: number) => {
            if (idx >= this.selectedContacts.length) {
                this.getContacts().then(() => {
                    this.selectedContacts = [];
                    // Trigger the next event
                    this.onSelectedContactsChanged.next(this.selectedContacts);
                });
                return;
            }
            const contactId = this.selectedContacts[idx];
            this.deleteContact(contactId).finally(() => {
                deleteSelected(idx + 1);
            });
        }
        if (this.selectedContacts.length > 0) {
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
                SrvApiEnvEnum.removeContact,
                [contactId]
            );
            this._http.PatchObs(httpConfig, true).subscribe((newUser: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.getContacts();
                resolve();
            }, resolve);
        });
    }

    /**
     * Delete selected contacts
     */
    deleteSelectedContacts(): void {
        for (const contactId of this.selectedContacts) {
            const contact = this.contacts.find((_contact) => {
                return _contact.id === contactId;
            });
            const contactIndex = this.contacts.indexOf(contact);
            this.contacts.splice(contactIndex, 1);
        }
        this.onContactsChanged.next(this.contacts);
        this.deselectContacts();
    }

    /**
     * Check if user.id is in already in contact list
     * @param userId - users.id
     * @returns 
     */
    inContact(userId: string): boolean {
        let isContact = false;
        this.contacts.some((contact) => {
            if (contact.friend_id === userId) {
                isContact = true;
                return true;
            }
        });
        return isContact;
    }

    /**
     * Check if user have blocked current login user
     * @param friendId - link users
     * @returns 
     */
    checkBlockByFriend(friendId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this._authTokenSession.currentAuthUser.id === friendId) {
                resolve({
                    user_id: this._authTokenSession.currentAuthUser.id,
                    friend_id: friendId,
                    blocked: false
                });
                return;
            } else {
                const httpConfig = this._http.getSrvHttpConfig(
                    SrvApiEnvEnum.blockedByUser,
                    [
                        this._authTokenSession.currentAuthUser.id,
                        friendId,
                    ]
                );
                this._http.GetObs(httpConfig, true).subscribe((resp: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    resolve(resp);
                }, reject);
            }
 
        });
    }
}
