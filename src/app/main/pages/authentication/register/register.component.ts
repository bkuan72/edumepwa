import { RegisterDTO } from './../../../../dtos/register-dto';
import { AlertService } from './../../../../services/alert/alert.service';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/services/authentication/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from 'app/services/logger/logger.service';

@Component({
    selector     : 'register',
    templateUrl  : './register.component.html',
    styleUrls    : ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy
{
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    warnAcceptTerms = false;
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private alertService: AlertService,
        private _auth: AuthenticationService,
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
        this.registerForm = this._formBuilder.group({
            name           : ['', Validators.required],
            email          : ['', [Validators.required, Validators.email]],
            password       : ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]],
            acceptTerms    : [false]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
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
                    // restore Configure the layout
        this._fuseConfigService.config = {
                        layout: {
                            navbar   : {
                                hidden: false
                            },
                            toolbar  : {
                                hidden: false
                            },
                            footer   : {
                                hidden: false
                            },
                            sidepanel: {
                                hidden: false
                            }
                        }
                    };
    }
    // convenience getter for easy access to form fields
    // tslint:disable-next-line:typedef
    get f() { return this.registerForm.controls; }

    onSubmit(): void {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        if (!this.f.acceptTerms.value) {
            this.warnAcceptTerms = true;
        }

        this.loading = true;
        let registerData: RegisterDTO;
        registerData = {
            email: this.f.email.value,
            username: this.f.name.value,
            password: this.f.password.value
        };
        this._auth.registerNewUser(registerData).then(() => {
            this._log.log('register user');
            this.router.navigate(['auth/mail-confirm', { username: registerData.username, email: registerData.email }]);
        })
        .catch(() => {
            this.alertService.error('Register User Failed');
            this.loading = false;
        });
    }

    showAcceptTermWarning(): boolean {
        return (this.warnAcceptTerms && !this.f.acceptTerms.value);
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

