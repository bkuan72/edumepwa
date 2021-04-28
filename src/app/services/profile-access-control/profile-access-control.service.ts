import { LocalStoreVarEnum } from './../../shared/local-store-var-enum';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MemberContactsService } from './../../main/apps/members/member-contacts.service';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { Injectable } from '@angular/core';
import { CommonFn } from 'app/shared/common-fn';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { OkDialogComponent } from 'app/components/ok-dialog/ok-dialog.component';
import { AuthTokenSessionService } from '../auth-token-session/auth-token-session.service';
import { Router } from '@angular/router';
import { SrvHttpService } from '../http-connect/srv-http.service';
import { SrvApiEnvEnum } from 'app/shared/SrvApiEnvEnum';
import { UserProfileSessionService } from '../session/user-profile-session.service';
import { AccountProfileSessionService } from '../session/account-profile-session.service';

@Injectable({
    providedIn: 'root',
})
export class ProfileAccessControlService {
    okDialogRef: MatDialogRef<OkDialogComponent>;

    constructor(
        private _authSession: AuthTokenSessionService,
        private _contactService: ContactsService,
        private _memberContactService: MemberContactsService,
        private _userSession: UserProfileSessionService,
        private _accountSession: AccountProfileSessionService,
        private _matDialog: MatDialog,
        private _fn: CommonFn
    ) {}


    gotoUserProfile(userId): void {
        if (userId === this._authSession.currentAuthUser.id) {
            this._userSession.goToUserProfile(userId);
        } else {
            this._contactService
            .checkBlockByFriend(userId)
            .then((resp) => {
                if (resp.blocked) {
                    this.okDialogRef = this._matDialog.open(
                        OkDialogComponent,
                        {
                            disableClose: false,
                        }
                    );
                    this.okDialogRef.componentInstance.confirmMessage =
                        'You have been blocked by User';
                    this.okDialogRef.afterClosed().subscribe((result) => {
                        this.okDialogRef = null;
                    });
                } else {
                    this._userSession.goToUserProfile(userId);
                }
            })
            .catch(() => {
                this.okDialogRef = this._matDialog.open(OkDialogComponent, {
                    disableClose: false,
                });
                this.okDialogRef.componentInstance.confirmMessage =
                    'Unable to goto Profile';
                this.okDialogRef.afterClosed().subscribe((result) => {
                    this.okDialogRef = null;
                });
            });
        }

    }

    gotoAccountProfile(userId: string, accountId: string): void {
        this._memberContactService
        .checkBlockByAccount(accountId, userId)
        .then((resp) => {
            if (resp.blocked) {
                this.okDialogRef = this._matDialog.open(
                    OkDialogComponent,
                    {
                        disableClose: false,
                    }
                );
                this.okDialogRef.componentInstance.confirmMessage =
                    'You have been blocked by Account';
                this.okDialogRef.afterClosed().subscribe((result) => {
                    this.okDialogRef = null;
                });
            } else {
                this._accountSession.goToAccountProfile(
                    accountId
                );
            }
        })
        .catch(() => {
            this.okDialogRef = this._matDialog.open(OkDialogComponent, {
                disableClose: false,
            });
            this.okDialogRef.componentInstance.confirmMessage =
                'Unable to goto Profile';
            this.okDialogRef.afterClosed().subscribe((result) => {
                this.okDialogRef = null;
            });
        });
    }

    gotoGroupProfile(userId: string, groupId: string): void {
        this._memberContactService      // TODO change to Group contact service
        .checkBlockByGroup(groupId, userId)
        .then((resp) => {
            if (resp.blocked) {
                this.okDialogRef = this._matDialog.open(
                    OkDialogComponent,
                    {
                        disableClose: false,
                    }
                );
                this.okDialogRef.componentInstance.confirmMessage =
                    'You have been blocked by Group';
                this.okDialogRef.afterClosed().subscribe((result) => {
                    this.okDialogRef = null;
                });
            } else {
                this._accountSession.goToAccountProfile(
                    groupId
                );
            }
        })
        .catch(() => {
            this.okDialogRef = this._matDialog.open(OkDialogComponent, {
                disableClose: false,
            });
            this.okDialogRef.componentInstance.confirmMessage =
                'Unable to goto Profile';
            this.okDialogRef.afterClosed().subscribe((result) => {
                this.okDialogRef = null;
            });
        });
    }


    gotoAccountMemberProfile(accountId: string, userId: string): void {
        this._memberContactService
        .checkAccountBlockByUser(accountId, userId)
        .then((resp) => {
            if (resp.blocked) {
                this.okDialogRef = this._matDialog.open(
                    OkDialogComponent,
                    {
                        disableClose: false,
                    }
                );
                this.okDialogRef.componentInstance.confirmMessage =
                    'Your Account have been blocked by User';
                this.okDialogRef.afterClosed().subscribe((result) => {
                    this.okDialogRef = null;
                });
            } else {
                this._userSession.goToUserProfile(
                    userId
                );
            }
        })
        .catch(() => {
            this.okDialogRef = this._matDialog.open(OkDialogComponent, {
                disableClose: false,
            });
            this.okDialogRef.componentInstance.confirmMessage =
                'Unable to goto Profile';
            this.okDialogRef.afterClosed().subscribe((result) => {
                this.okDialogRef = null;
            });
        });
    }

    gotoGroupMemberProfile(accountId: string, userId: string): void {
        this._memberContactService // TODO change to group contact service
        .checkAccountBlockByUser(accountId, userId)
        .then((resp) => {
            if (resp.blocked) {
                this.okDialogRef = this._matDialog.open(
                    OkDialogComponent,
                    {
                        disableClose: false,
                    }
                );
                this.okDialogRef.componentInstance.confirmMessage =
                    'Your Account have been blocked by User';
                this.okDialogRef.afterClosed().subscribe((result) => {
                    this.okDialogRef = null;
                });
            } else {
                this._userSession.goToUserProfile(
                    userId
                );
            }
        })
        .catch(() => {
            this.okDialogRef = this._matDialog.open(OkDialogComponent, {
                disableClose: false,
            });
            this.okDialogRef.componentInstance.confirmMessage =
                'Unable to goto Profile';
            this.okDialogRef.afterClosed().subscribe((result) => {
                this.okDialogRef = null;
            });
        });
    }

    gotoFriendContactProfile(contact): void {
        if (!this._fn.isZeroUuid(contact.friend_id)) {
            this.gotoUserProfile(contact.friend_id);
        } else if (!this._fn.isZeroUuid(contact.account_id)) {
            this.gotoAccountProfile(contact.user_id, contact.account_id);
        } else if (!this._fn.isZeroUuid(contact.group_id)) {
            this.gotoGroupProfile(contact.user_id, contact.group_id);
        } else {
            this.okDialogRef = this._matDialog.open(OkDialogComponent, {
                disableClose: false,
            });
            this.okDialogRef.componentInstance.confirmMessage =
                'Contact is NOT a Registered User';
            this.okDialogRef.afterClosed().subscribe((result) => {
                this.okDialogRef = null;
            });
        }
    }

    gotoMemberContactProfile(contact): void {
        if (!this._fn.isZeroUuid(contact.account_id)) {
            this.gotoAccountMemberProfile(contact.account_id, contact.user_id);
        } else
        if (!this._fn.isZeroUuid(contact.group_id)) {
            this.gotoGroupMemberProfile(contact.group_id, contact.user_id);
        } else {
            this.okDialogRef = this._matDialog.open(OkDialogComponent, {
                disableClose: false,
            });
            this.okDialogRef.componentInstance.confirmMessage =
                'Contact is NOT a Registered User';
            this.okDialogRef.afterClosed().subscribe((result) => {
                this.okDialogRef = null;
            });
        }
    }

}
