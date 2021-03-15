import { ImageDropUploadComponent } from './../../../../../components/image-drop-upload/image-drop-upload.component';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

import { ProfileService } from 'app/main/pages/profile/profile.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { ModuleCodeEnum } from 'app/shared/module-code-enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AngularMaterialImageOverlayService } from 'angular-material-image-overlay';
import { CommonFn } from 'app/shared/common-fn';

@Component({
    selector     : 'profile-photos-videos',
    templateUrl  : './photos-videos.component.html',
    styleUrls    : ['./photos-videos.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ProfilePhotosVideosComponent implements OnInit, OnDestroy
{
    @ViewChild('appImageUpload') appImageUpload: ImageDropUploadComponent;
    @Output() uploadCompleted: EventEmitter<any> = new EventEmitter();

    readOnly = false;
    hideUpload = true;
    ownerOfProfile = false;
    canDev = false;
    disableDone = false;

    periodId: string;
    periodName: string;
    periodInfo: string;
    user: any;
    account: any;
    group: any;
    photosVideos: any[];
    form: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ProfileService} _profileService
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _profileService: ProfileService,
        private _auth: AuthTokenSessionService,
        private imageOverlayService: AngularMaterialImageOverlayService,
        private _fn: CommonFn
    )
    {
        this.canDev = this._auth.canDev(ModuleCodeEnum.Maintenance);


        this.photosVideos = [];
        this.user = this._profileService.user;
        this.ownerOfProfile = false;
        if (
            this._auth.currentAuthUser &&
            this._auth.currentAuthUser.id === this.user.id
        ) {
            this.ownerOfProfile = true;
        }
        this.account = this._profileService._accountService.account;
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
        this._profileService.userOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((user) => {
            this.user = user;
            this.ownerOfProfile = false;
            if (
                this._auth.currentAuthUser &&
                this._auth.currentAuthUser.id === this.user.id
            ) {
                this.ownerOfProfile = true;
            }
        });
        this.form = this._formBuilder.group({
            period   : ['', [Validators.maxLength(20)]],
            info     : ['', [Validators.maxLength(200)]],
        });
        this._profileService.photosVideosOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(photosVideos => {
                this.photosVideos = photosVideos;
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
    onSubmit(): void {
        this.periodName = this.form.controls['period'].value;
        this.periodInfo = this.form.controls['info'].value;
    }

    setUploadPeriod(currentPeriod: any): void {
        this.resetUpload();
        if (currentPeriod) {
            this.readOnly = true;
            this.periodId = currentPeriod.id;
            this.periodName = currentPeriod.period;
            this.periodInfo = currentPeriod.info;
        } else {
            this.readOnly = false;
            const now = new Date();
            this.periodId = '';
            this.periodName = moment(now).format('MMMM YYYY');;
            this.periodInfo = '';
        }
        if (this.readOnly) {
            this.form.controls.period.disable({onlySelf: true});
            this.form.controls.info.disable({onlySelf: true});
        } else {
            this.form.controls.period.enable({onlySelf: true});
            this.form.controls.info.enable({onlySelf: true});
        }
        this.hideUpload = false;
        this.form.setValue({
            period: this.periodName,
            info: this.periodInfo
        });
        if (this.appImageUpload) {
            this.appImageUpload.reset(this.periodId);
        }
    }

    resetUpload(): void {
        const now = new Date();
        this.hideUpload = true;
        this.periodId = '';
        this.periodName = moment(now).format('MMMM YYYY');;
        this.periodInfo = '';
        this.form.setValue({
            period: this.periodName,
            info: this.periodInfo
        });
        if (this.appImageUpload) {
            this.appImageUpload.reset();
        }
    }

    doneUpload(): void {
        this.resetUpload();
        this.uploadCompleted.emit();
    }

    showAllMedia(period: any): void {
        if (period.showAllMedia) {
            period.showAllMedia = false;
        } else {
            period.loadingMedia = true;
            this._profileService._mediaService.getMediaPeriodPhotosVideos(period).then((periodMedias) => {
                period.medias = periodMedias;
                period.loadingMedia = false;
            });
            this.photosVideos.forEach((per) => {
                if (per.id !== period.id) {
                    per.showAllMedia = false;
                } else {
                    per.showAllMedia = true;
                }
            });
        }
    }
    /**
     * To allow tracking of array to prevent regeneration of html for the array element that has not changed
     * in the array
     * @param index - array idx
     * @param item  - array item
     */
    trackByUuid(index: number, image: any): string {
        if (image !== null) {
            return image.id;
        } else {
            return '';
        }
    }

    showFullImage(media: any): void {
        if (this._fn.emptyStr(media.fullImage)) {
            this._profileService._mediaService.getFullImage(media.id).then ((image) => {
                const images: string[] = [];
                images.push(image.fullImage);
                media.fullImage = image.fullImage;
                this.imageOverlayService.open(images);
            }).catch(() => {});
        } else {
            const images: string[] = [];
            images.push(media.fullImage);
            this.imageOverlayService.open(images);
        }
    }
}
