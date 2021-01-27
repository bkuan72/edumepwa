import { CommonFn } from './../../../../shared/common-fn';
import { ProfileService } from 'app/main/pages/profile/profile.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
    selector   : 'user-profile-maintenance-forms',
    templateUrl: './user-profile-maintenance-forms.component.html',
    styleUrls  : ['./user-profile-maintenance-forms.component.scss']
})
export class UserProfileMaintenanceFormsComponent implements OnInit, OnDestroy
{
    submitted = false;
    user: any;
    userData: any;
    userDTO: any;
    updUserDTO: any;
    insUserDTO: any;
    userSchema: any;
    countries: any;
    titles: any;
    form: FormGroup;


    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _userProfile: ProfileService,
        private _fn: CommonFn,
        private loc: Location
    )
    {
        this.user = this._userProfile.user;
        this.userDTO = this._userProfile.userDTO;
        this.updUserDTO = this._userProfile.updUserDTO;
        this.insUserDTO = this._userProfile.insUserDTO;
        this.userSchema = this._userProfile.userSchema;
        this.countries = this._userProfile.countries;
        this.titles = this._userProfile.titles;
        this._userProfile.getUserData();
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
        this._userProfile.userDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(userDTO => {
            this.userDTO = userDTO;
        });
        this._userProfile.insUserDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(insUserDTO => {
            this.insUserDTO = insUserDTO;
        });
        this._userProfile.updUserDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(updUserDTO => {
            this.updUserDTO = updUserDTO;
        });
        this._userProfile.userSchemaOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(userSchema => {
            this.userSchema = userSchema;
        });
        this._userProfile.countriesOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(countries => {
            this.countries = countries;
        });
        this._userProfile.titlesOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(titles => {
            this.titles = titles;
        });
        // Reactive Form
        this.form = this._formBuilder.group({
            email   : [
                {
                    value   : '',
                    disabled: true
                }, Validators.required
            ],
            gender   : ['', [Validators.maxLength(10)]],
            title   : ['', [Validators.required, Validators.maxLength(10)]],
            first_name : ['', [Validators.required, Validators.maxLength(60)]],
            last_name  : ['', [Validators.required, Validators.maxLength(60)]],
            user_name  : ['', [Validators.required, Validators.maxLength(60)]],
            address   : ['', [Validators.required, Validators.maxLength(255)]],
            suburb  : ['', [Validators.required, Validators.maxLength(40)]],
            city      : ['', [Validators.required, Validators.maxLength(40)]],
            state     : ['', [Validators.maxLength(40)]],
            post_code: ['', [Validators.required, Validators.maxLength(10)]],
            country   : ['', [Validators.required, Validators.maxLength(40)]],
            website     : ['', [Validators.maxLength(255)]],
            birthday     : [''],
            about_me     : ['', [Validators.maxLength(255)]],
            occupation     : ['', [Validators.maxLength(255)]],
            skills     : ['', [Validators.maxLength(255)]],
            jobs     : ['', [Validators.maxLength(255)]],
        });

        this._userProfile.userDataOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(userData => {
            if (userData !== undefined) {
                this.userData = userData;

                const formData = this._fn.mapObj(this.form.controls, userData);
                this.form.setValue(formData);
            }
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    onSubmit(): void {
        if (this.submitted) {
            return;
        }
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        // stop if no change
        const updUser = this._fn.mapObjChangedPropertyValue(this.form.controls, this.userData);
        if (updUser === undefined) {
            this.loc.back();
            return;
        }

        this._userProfile.updateUserData(this.user.id, updUser)
        .then(() => {
            this.loc.back();
        })
        .catch(() => {

        });
    }
}
