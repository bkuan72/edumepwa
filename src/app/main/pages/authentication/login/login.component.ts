import { UserProfileSessionService } from 'app/services/session/user-profile-session.service';
import { AlertService } from './../../../../services/alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginDTO } from './../../../../dtos/login-dto';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { LoggerService } from 'app/services/logger/logger.service';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit, OnDestroy
{
    rememberMe = true;
    loginForm: FormGroup;
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
        private route: ActivatedRoute,
        private router: Router,
        private _formBuilder: FormBuilder,
        private _auth: AuthTokenSessionService,
        private _log: LoggerService,
        private alertService: AlertService,
        private _session: UserProfileSessionService
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
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: [this.rememberMe]
        });
    }

    ngOnDestroy(): void
    {
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
    get f() { return this.loginForm.controls; }

    onSubmit(): void {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        let loginData: LoginDTO;
        loginData = {
            email: this.f.email.value,
            password: this.f.password.value
        };
        this.rememberMe = this.f.rememberMe.value;
        this._auth.login(loginData, this.rememberMe).then(() => {
            this._log.log('logged in');

            // get return url from query parameters or default to home page
            // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            // this.router.navigateByUrl(returnUrl);
            this._session.goToUserProfile(this._auth.currentAuthUser.id);
        })
        .catch(() => {
            this.alertService.error('Login Failed');
            this.loading = false;
        });
    }
}
