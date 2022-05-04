import { RedirectService } from './../../../../services/redirect/redirect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/services/authentication/authentication.service';
import { AppSettingsService } from 'app/services/app-settings/app-settings.service';


@Component({
    selector     : 'mail-device-confirm',
    templateUrl  : './mail-device-confirm.component.html',
    styleUrls    : ['./mail-device-confirm.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class MailDeviceConfirmComponent implements OnInit
{
    validated: boolean;
    regConfirmKey: string;
    deviceUuid: string;
    email: string;
    ls10deliverUrl: string;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private actRouter: ActivatedRoute,
        private router: Router,
        private _auth: AuthenticationService,
        private _appSetting: AppSettingsService,
        private _redirect: RedirectService
    )
    {
        this.ls10deliverUrl = this._appSetting.settingsValue.deliveryLoginUrl;
        this.deviceUuid = '';
        this.email = '';
        this.regConfirmKey = '';
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
        this.actRouter.params.subscribe(params => {
            this.deviceUuid = params['deviceUuid'];
            this.email = params['email'];
            this.regConfirmKey = params['regConfirmKey'];
            this._auth.emailDeviceConfirmation(this.email, this.deviceUuid, this.regConfirmKey)
            .then(() => {
                this.validated = true;
            })
            .catch(() => {
                this.router.navigateByUrl('errors/error-404');
            });
        });
    }

    navigateToLs10Delivery(): void {
        this._redirect.navigate(this.ls10deliverUrl);
    }
}
