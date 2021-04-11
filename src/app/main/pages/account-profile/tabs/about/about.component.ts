import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { AccountProfileService } from 'app/main/pages/account-profile/account-profile.service';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { CommonFn } from 'app/shared/common-fn';
import { OkDialogComponent } from 'app/components/ok-dialog/ok-dialog.component';
import { UserProfileSessionService } from 'app/services/session/user-profile-session.service';

@Component({
    selector     : 'profile-about',
    templateUrl  : './about.component.html',
    styleUrls    : ['./about.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ProfileAboutComponent implements OnInit, OnDestroy
{
    ownerOfProfile = false;
    areAccountGroupMembers = false;
    showFullProfile = false;
    account: any;
    about: any;
    members: any[];
    groups: any[];

    // Private
    private _unsubscribeAll: Subject<any>;
    confirmDialogRef: MatDialogRef<OkDialogComponent>;

    /**
     * Constructor
     *
     * @param {ProfileService} _profileService
     */
    constructor(
        private _profileService: AccountProfileService,
        private router: Router,
        public fn: CommonFn,
        private _matDialog: MatDialog,
        private _userProfile: UserProfileSessionService
    )
    {
        this.ownerOfProfile = this._profileService.ownerOfProfile;
        this.areAccountGroupMembers = this._profileService.areAccountGroupMembers;
        this.showFullProfile = this._profileService.showFullProfile;

        this.members = [];
        this.groups = [];
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._profileService.accountOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((account) => {
            this.account = account;
            this.ownerOfProfile = this._profileService.ownerOfProfile;
            this.areAccountGroupMembers = this._profileService.areAccountGroupMembers;
            this.showFullProfile = this._profileService.showFullProfile;
        });
        this._profileService.ownerOfProfileOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((ownerOfProfile) => {
            this.ownerOfProfile = ownerOfProfile;
        });
        this._profileService.aboutOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(about => {
                this.about = about;
            });
        this._profileService.membersOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(members => {
            this.members = members;
        });
        this._profileService.groupsOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(groups => {
            this.groups = groups;
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    goToContacts(): void {
        this.router.navigateByUrl('contacts');
    }

    addNewGroup(): void {

    }

    gotoProfile(friend): void {
        if (this.fn.isZeroUuid(friend.friend_id)) {
            this.confirmDialogRef = this._matDialog.open(OkDialogComponent, {
                disableClose: false
            });
            this.confirmDialogRef.componentInstance.confirmMessage = 'Friend is NOT a Registered User';
            this.confirmDialogRef.afterClosed().subscribe(result => {

                this.confirmDialogRef = null;
            });
        } else {
            this._userProfile.goToUserProfile(friend.friend_id);
        }

    }
}
