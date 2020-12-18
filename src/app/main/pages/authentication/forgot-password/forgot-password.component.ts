import { LoggerService } from 'app/services/logger/logger.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication/authentication.service';
import { AlertService } from 'app/services/alert/alert.service';

@Component({
    selector     : 'forgot-password',
    templateUrl  : './forgot-password.component.html',
    styleUrls    : ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ForgotPasswordComponent implements OnInit
{
    forgotPasswordForm: FormGroup;
    loading = false;
    submitted = false;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private _auth: AuthenticationService,
        private alertService: AlertService,
        private _log: LoggerService
    )
    {
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


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }


    // convenience getter for easy access to form fields
    // tslint:disable-next-line:typedef
    get f() { return this.forgotPasswordForm.controls; }
    onSubmit(): void {
        if (this.submitted) {
            return;
        }
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.forgotPasswordForm.invalid) {
            return;
        }



        this.loading = true;

        this._auth.resetPasswordConfirmation(this.f.email.value).then(() => {
            this._log.log('reset password confirmation');
            this.router.navigate(['auth/reset-password-confirm', { email: this.f.email.value }]);
        })
        .catch(() => {
            this.alertService.error('Register User Failed');
            this.loading = false;
        });
    }
}
