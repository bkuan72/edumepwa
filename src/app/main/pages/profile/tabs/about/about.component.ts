import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { ProfileService } from 'app/main/pages/profile/profile.service';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { CommonFn } from 'app/shared/common-fn';
import { OkDialogComponent } from 'app/components/ok-dialog/ok-dialog.component';
import { UserProfileSessionService } from 'app/services/session/user-profile-session.service';
import { ProfileAccessControlService } from 'app/services/profile-access-control/profile-access-control.service';

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
    areFriends = false;
    showFullProfile = false;
    user: any;
    about: any;
    friends: any[];
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
        private _profileService: ProfileService,
        private router: Router,
        private _auth: AuthTokenSessionService,
        public fn: CommonFn,
        private _profileAccessCtrl: ProfileAccessControlService
    )
    {
        this.ownerOfProfile = false;
        this.user = this._profileService.user;
        if (
            this._auth.currentAuthUser &&
            this._auth.currentAuthUser.id === this.user.id
        ) {
            this.ownerOfProfile = true;
        }
        this.areFriends = this._profileService.areFriends;
        this.showFullProfile = this._profileService.showFullProfile;

        this.friends = [];
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
        this._profileService.userOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((user) => {
            this.user = user;
            this.ownerOfProfile = false;
            if (
                this._auth.currentAuthUser &&
                this._auth.currentAuthUser.id === this.user.id
            ) {
                this.ownerOfProfile = true;
            }
            this.areFriends = this._profileService.areFriends;
            this.showFullProfile = this._profileService.showFullProfile;
        });
        this._profileService.aboutOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(about => {
                this.about = about;
            });
        this._profileService.friendsOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(friends => {
            this.friends = friends;
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
        this._profileAccessCtrl.gotoFriendContactProfile(friend);
    }
}
