import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/services/authentication/authentication.service';
import { LoggerService } from 'app/services/logger/logger.service';
import { AlertService } from 'app/services/alert/alert.service';

@Component({
    selector     : 'reset-password',
    templateUrl  : './reset-password.component.html',
    styleUrls    : ['./reset-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ResetPasswordComponent implements OnInit, OnDestroy
{
    validated = false;
    email: string;
    resetPasswordKey: string;
    resetPasswordForm: FormGroup;
    loading = false;
    submitted = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private actRoute: ActivatedRoute,
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
        this.actRoute.params.subscribe(params => {
            this.resetPasswordKey = params['pwd_reset_key'];
            this.email = params['email'];

            this._auth.validResetPasswordKey(this.email, this.resetPasswordKey)
            .then(() => {
                this.validated = true;
                this.resetPasswordForm.controls.email.setValue(this.email);
            })
            .catch(() => {
                this.router.navigateByUrl('errors/error-404');
            });
        });
        this.resetPasswordForm = this._formBuilder.group({
            email          : ['', [Validators.required, Validators.email]],
            password       : ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.resetPasswordForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
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

        // convenience getter for easy access to form fields
    // tslint:disable-next-line:typedef
    get f() { return this.resetPasswordForm.controls; }
    onSubmit(): void {
        if (this.validated && this.submitted) {
            return;
        }
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }



        this.loading = true;

        this._auth.updateUserPassword(this.email, this.resetPasswordKey, this.f.password.value).then(() => {
            this._log.log('reset password confirmation');
            this.router.navigateByUrl('auth/login');
        })
        .catch(() => {
            this.alertService.error('Update User Password Failed');
            this.loading = false;
        });
    }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm )
    {
        return null;
    }

    if ( passwordConfirm.value === '' )
    {
        return null;
    }

    if ( password.value === passwordConfirm.value )
    {
        return null;
    }

    return {passwordsNotMatching: true};
};
