import { SrvHttpService } from 'app/services/http-connect/srv-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/services/authentication/authentication.service';

@Component({
    selector     : 'mail-confirmation',
    templateUrl  : './mail-confirmation.component.html',
    styleUrls    : ['./mail-confirmation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class MailConfirmationComponent implements OnInit
{
    validated: boolean;
    regConfirmKey: string;
    email: string;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private actRoute: ActivatedRoute,
        private router: Router,
        private _auth: AuthenticationService
    )
    {
        this.validated = false;
        this.regConfirmKey = '';
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
        this.actRoute.params.subscribe(params => {
            this.regConfirmKey = params['reg_confirm_key'];
            this.email = params['email'];

            this._auth.emailConfirmation(this.email, this.regConfirmKey)
            .then(() => {
                this.validated = true;
            })
            .catch(() => {
                this.router.navigateByUrl('errors/error-404');
            });
        });
    }
}
