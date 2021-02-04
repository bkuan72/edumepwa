import { CommonFn } from './../../../../shared/common-fn';
import { LoginDTO } from './../../../../dtos/login-dto';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Location } from '@angular/common';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { Subject } from 'rxjs';

@Component({
    selector     : 'lock',
    templateUrl  : './lock.component.html',
    styleUrls    : ['./lock.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LockComponent implements OnInit
{
    currentUser: any;
    email: string;
    lockForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private location: Location,
        private router: Router,
        private _authSession: AuthTokenSessionService,
        public fn: CommonFn
    )
    {
        if (this._authSession.currentAuthUser) {
            this.currentUser = this._authSession.currentAuthUser;
        }
        this.email = '';
        this._authSession.resetAuthUser();

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
        if (this._authSession.currentAuthUser === undefined || this._authSession.currentAuthUser === null) {
            this.router.navigateByUrl('home');
            return;
        }
        this.lockForm = this._formBuilder.group({
            email: [
                {
                    value   : this._authSession.currentAuthUser.email,
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
            email: this._authSession.currentAuthUser.email,
            password: this.f.password.value
        };
        this._authSession.login(loginData, this._authSession.rememberMe).then(() => { 
            this.location.back();
        })
        .catch(() => {
            // this.router.navigateByUrl('auth/login');
        });
    }
}
