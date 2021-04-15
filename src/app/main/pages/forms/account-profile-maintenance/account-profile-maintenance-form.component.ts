import { AdKeywordService } from 'app/services/ad-keyword/ad-keyword.service';
import { AdCategoryService } from 'app/services/ad-category/ad-category.service';
import { AdAgeGroupService } from 'app/services/ad-age-group/ad-age-group.service';
import { ProfileService } from 'app/main/pages/profile/profile.service';
import { CommonFn } from '../../../../shared/common-fn';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { CroppedEvent } from 'ngx-photo-editor';

@Component({
    selector   : 'account-profile-maintenance-forms',
    templateUrl: './account-profile-maintenance-form.component.html',
    styleUrls  : ['./account-profile-maintenance-form.component.scss']
})
export class AccountProfileMaintenanceFormsComponent implements OnInit, OnDestroy
{
    @ViewChild('uploadAvatarFileInput') myUploadAvatarFileInput: ElementRef;
    canDelete = true;
    specialAccount = false;
    newAccount = false;
    submitted = false;
    avatar: any;

    showAvatarEditor = false;
    avatarChangedEvent: any;

    account: any;
    accountData: any;
    accountDTO: any;
    updAccountDTO: any;
    accountSchema: any;
    countries: any;
    form: FormGroup;

    ageGroupCodes: string[] = [];
    categoryCodes: string[] = [];
    keywordCodes: string[] = [];


    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _auth: AuthTokenSessionService,
        private _profileService: ProfileService,
        private _ageGroupService: AdAgeGroupService,
        private _categoryService: AdCategoryService,
        private _keywordService: AdKeywordService,
        public _fn: CommonFn,
        private loc: Location
    )
    {
        this.ageGroupCodes = this._ageGroupService.ageGroupCodes;
        this.categoryCodes = this._categoryService.categoryCodes;
        this.keywordCodes = this._keywordService.keywordCodes;
        this.account = this._profileService._accountService.accounts;
        this.accountDTO = this._profileService._accountService.accountsDTO;
        this.updAccountDTO = this._profileService._accountService.accountsUpdDTO;
        this.accountSchema = this._profileService._accountService.accountsSchema;
        this.countries = this._profileService.countries;
                // Reactive Form
        this.form = this._formBuilder.group({
            account_code  : [{value: '', disabled: true}],
            account_type  : ['', Validators.required],
            account_name  : ['', [Validators.required, Validators.maxLength(100)]],
            description  : ['', [Validators.required, Validators.maxLength(100)]],
            about_me     : ['', [Validators.required, Validators.maxLength(255)]],
            avatar  : [''],
            email  : ['', [Validators.required, Validators.maxLength(100)]],
            phone_no  : ['', [Validators.required, Validators.maxLength(30)]],
            mobile_no  : ['', [Validators.required, Validators.maxLength(30)]],
            website     : ['', [Validators.maxLength(255)]],
            address   : ['', [Validators.required, Validators.maxLength(255)]],
            suburb  : ['', [Validators.required, Validators.maxLength(40)]],
            city      : ['', [Validators.required, Validators.maxLength(40)]],
            state     : ['', [Validators.maxLength(40)]],
            post_code: ['', [Validators.required, Validators.maxLength(10)]],
            country   : ['', [Validators.required, Validators.maxLength(40)]],
            ageGroups   : ['', [Validators.required, Validators.maxLength(255)]],
            categories   : ['', [Validators.required, Validators.maxLength(255)]],
            keywords   : ['', [Validators.required, Validators.maxLength(255)]],
            allow_notification: [true],
            allow_promo: [true],
            allow_msg: [true],
            allow_friends: [true],
            allow_follows: [true],
            public: [true]
        });

        this._ageGroupService.doLoadAgeGroupCodes();
        this._categoryService.doLoadCategoryCodes();
        this._keywordService.doLoadKeywordCodes();

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
        if (this._fn.emptyStr(this._profileService._accountService.account.id)) {
            this.newAccount = true;
        } else {
            if (this._profileService._accountService.account.account_type === 'DEV' ||
            this._profileService._accountService.account.account_type === 'ADMIN') {
                this.specialAccount = true;
            }
            this.avatar = this._profileService._accountService.account.avatar;
        }

        if (this.newAccount) {
            const accountData = this._fn.mapObj(this.form.controls, this._profileService.userFullData);
            this._fn.mapObjValueToForm(accountData, this.form);
        } else {
            const accountData = this._fn.mapObj(this.form.controls, this._profileService._accountService.account);
            this._fn.mapObjValueToForm(accountData, this.form);
            this.form.controls['account_type'].disable( { onlySelf: true });
        }
        this._profileService._accountService.accountsDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(accountDTO => {
            this.accountDTO = accountDTO;
        });
        this._profileService._accountService.accountsUpdDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(updAccountDTO => {
            this.updAccountDTO = updAccountDTO;
        });
        this._profileService._accountService.accountsSchemaOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(accountSchema => {
            this.accountSchema = accountSchema;
        });
        this._profileService.countriesOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(countries => {
            this.countries = countries;
        });
        this._profileService._accountService.accountOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(accountData => {
            if (accountData !== undefined) {
                this.account = accountData;
                if (!this._fn.emptyStr(accountData.id)) {
                    const formData = this._fn.mapObj(this.form.controls, accountData);
                    this._fn.mapObjValueToForm(accountData, this.form);
                    // this.form.setValue(formData);
                }
            }
        });
        this._ageGroupService.ageGroupCodesOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(ageGroupCodes => {
            this.ageGroupCodes = ageGroupCodes;
        });
        this._categoryService.categoryCodesOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(categoryCodes => {
            this.categoryCodes = categoryCodes;
        });
        this._keywordService.keywordCodesOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(keywordCodes => {
            this.keywordCodes = keywordCodes;
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
        const updAccount = this._fn.mapFormControlChangedPropertyValue(this.form.controls, this.account);
        if (updAccount === undefined) {
            this.submitted = false;
            this.loc.back();
            return;
        }

        if (this._fn.emptyStr(this.account.id)) {
            if (this.account.account_type === 'NORMAL') {
                this._profileService._accountService.addNormalAccount(
                    this._profileService.user.id,
                    updAccount)
                .then(() => {
                    this.submitted = false;
                    this.loc.back();
                })
                .catch(() => {
                    this.submitted = false;
                });
            } else {
                if (this.account.account_type === 'SERVICE') {
                    this._profileService._accountService.addServiceAccount(
                    this._profileService.user.id,
                    updAccount)
                    .then(() => {
                        this.submitted = false;
                        this.loc.back();
                    })
                    .catch(() => {
                        this.submitted = false;
                    });
                }
            }
        } else {
            this._profileService._accountService.updateAccount(this.account.id, updAccount)
            .then(() => {
                this.submitted = false;
                this.loc.back();
            })
            .catch(() => {
                this.submitted = false;
            });
        }
    }
    isAuth(): boolean {
        return this._auth.isLoggedIn();
    }
    fileChangeEvent(event: any): void {
        this.avatarChangedEvent = event;
        this.showAvatarEditor = true;
    }


    avatarCropped(event: CroppedEvent): void {
        this._fn.toAvatarDataURL(event.base64).then((avatarData) => {
            if (this._fn.emptyStr(this.account.id)) {
                this.form.patchValue({avatar: avatarData});
                this.avatar = avatarData;
                if (this.myUploadAvatarFileInput) {
                    this.myUploadAvatarFileInput.nativeElement.value = '';
                }
                this.showAvatarEditor = false;
            } else {
                this._profileService._accountService
                .updateAccountAvatar(this.account.id, avatarData)
                .then(() => {
                    if (this.myUploadAvatarFileInput) {
                        this.myUploadAvatarFileInput.nativeElement.value = '';
                    }
                    this.showAvatarEditor = false;
                })
                .catch(() => {});
            }
        });
    }
}
