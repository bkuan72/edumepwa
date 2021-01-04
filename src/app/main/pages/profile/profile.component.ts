import { CommonFn } from './../../../shared/common-fn';
import { Component, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { ProfileService } from './profile.service';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';

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
    allowFollow: boolean;
    /**
     * Constructor
     */
    constructor(
        private _auth: AuthTokenSessionService,
        public fn: CommonFn,
        private _profileService: ProfileService
    ) {
        this.user = this._profileService.user;
        this.allowFollow = true;
        if (this._auth.userValue &&
            this._auth.userValue.id === this.user.id) {
                this.allowFollow = false;
            }
    }

    isAuth(): boolean {
        return this._auth.isLoggedIn();
    }
}
