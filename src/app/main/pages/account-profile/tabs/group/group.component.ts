import { CommonFn } from 'app/shared/common-fn';
import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { AccountProfileService } from '../../account-profile.service';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';

@Component({
    selector     : 'profile-group',
    templateUrl  : './group.component.html',
    styleUrls    : ['./group.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class GroupsComponent implements OnInit, OnDestroy
{
    @Input() group: any;
    account: any;
    canAddMember = true;    // TODO: check access right
    canAddGroup = true;    // TODO: check access right
    ownerOfProfile = true; // TODO: check login profile
    about: any;
    members: any[];
    groups: any[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ProfileService} _profileService
     */
    constructor(
        private _profileService: AccountProfileService,
        public fn: CommonFn,
        private _auth: AuthTokenSessionService
    )
    {
        this.ownerOfProfile = false;
        this.account = this._profileService.account;
        this.ownerOfProfile = this._profileService.ownerOfProfile;
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
        });
        this._profileService.aboutOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(about => {
                this.about = about;
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


    addNewMember(): void {

    }
    addNewGroup(): void {

    }
}
