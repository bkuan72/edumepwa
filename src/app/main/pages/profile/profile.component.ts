import { CommonFn } from './../../../shared/common-fn';
import { AuthenticationService } from './../../../services/authentication/authentication.service';
import { Component, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

@Component({
    selector     : 'profile',
    templateUrl  : './profile.component.html',
    styleUrls    : ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ProfileComponent
{
    user: any;
    /**
     * Constructor
     */
    constructor(private auth: AuthenticationService,
                public  fn: CommonFn)
    {
        this.user = this.auth.userValue;
    }

    isAuth(): boolean {
        return this.auth.isLoggedIn();
    }

}
