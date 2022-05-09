import { ActivatedRoute } from '@angular/router';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { RedirectService } from 'app/services/redirect/redirect.service';

@Component({
    selector     : 'reset-password-confirm',
    templateUrl  : './reset-password-confirm.component.html',
    styleUrls    : ['./reset-password-confirm.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ResetPasswordConfirmComponent implements OnInit
{
    email: string;
    navigateToUrl: string;
    urlDescription: string;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private activeRouter: ActivatedRoute,
        private redirect: RedirectService
    )
    {
        this.email = '';
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    ngOnInit(): void {
        this.activeRouter.params.subscribe(params => {
            this.email = params['email'];
            this.navigateToUrl = params['navigateToUrl'];
            this.urlDescription = params['urlDescription'];
        });
    }

    public redirectToUrl(): void {
        this.redirect.navigate(this.navigateToUrl);
    }
}
