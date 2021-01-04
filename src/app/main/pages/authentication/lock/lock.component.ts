import { CommonFn } from './../../../../shared/common-fn';
import { LoginDTO } from './../../../../dtos/login-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Location } from '@angular/common';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';

@Component({
    selector     : 'lock',
    templateUrl  : './lock.component.html',
    styleUrls    : ['./lock.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LockComponent implements OnInit
{
    user: any;
    currentUser: any;
    email: string;
    lockForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private activeRoute: ActivatedRoute,
        private location: Location,
        private router: Router,
        private _auth: AuthTokenSessionService,
        public fn: CommonFn
    )
    {
        this.user = this._auth.userValue;
        this.email = '';
        this.currentUser = this.user;
        this._auth.resetAuthUser();

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

        this.lockForm = this._formBuilder.group({
            email: [
                {
                    value   : this.currentUser.email,
                    disabled: true
                }, Validators.required
            ],
            password: ['', Validators.required]
        });
    }
    // convenience getter for easy access to form fields
    // tslint:disable-next-line:typedef
    get f() { return this.lockForm.controls; }

    doSubmit(): void {
        let loginData: LoginDTO;
        loginData = {
            email: this.currentUser.email,
            password: this.f.password.value
        };
        this._auth.login(loginData, this._auth.rememberMe).then(() => { 
            this.location.back();
        })
        .catch(() => {
            // this.router.navigateByUrl('auth/login');
        });
    }
}
