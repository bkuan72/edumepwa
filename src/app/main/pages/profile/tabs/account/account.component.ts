import { CommonFn } from 'app/shared/common-fn';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { ProfileService } from '../../profile.service';
import { AccountsService } from 'app/services/account/account.service';

@Component({
    selector     : 'profile-account',
    templateUrl  : './account.component.html',
    styleUrls    : ['./account.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AccountsComponent implements OnInit, OnDestroy
{
    @Input() account: any;
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
        private _profileService: ProfileService,
        private router: Router,
        private _accountService: AccountsService,
        public fn: CommonFn
    )
    {
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
