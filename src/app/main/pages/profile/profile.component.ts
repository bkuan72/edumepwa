import { CommonFn } from './../../../shared/common-fn';
import { AuthenticationService } from './../../../services/authentication/authentication.service';
import { Component, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { ProfileService } from './profile.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ProfileComponent {
    userId: string;
    user: any;
    /**
     * Constructor
     */
    constructor(
        private auth: AuthenticationService,
        public fn: CommonFn,
        private _profileService: ProfileService
    ) {
        this.user = this._profileService.user;
    }

    isAuth(): boolean {
        return this.auth.isLoggedIn();
    }
}
