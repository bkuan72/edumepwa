import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonFn } from '../../../shared/common-fn';
import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef,
} from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { AccountProfileService } from './account-profile.service';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { Subject } from 'rxjs';
import { CroppedEvent } from 'ngx-photo-editor';
import { ModuleCodeEnum } from 'app/shared/module-code-enum';
import { AccountsService } from 'app/services/account/account.service';

@Component({
    selector: 'account-profile',
    templateUrl: './account-profile.component.html',
    styleUrls: ['./account-profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AccountProfileComponent implements OnInit, OnDestroy {
    @ViewChild('uploadAvatarFileInput') myUploadAvatarFileInput: ElementRef;
    panelOpenState = false;
    canDev: boolean;
    accountTimelineDTO: any;
    postDTO: any;
    updPostDTO: any;
    postSchema: any;
    postMediaDTO: any;
    postMediaSchema: any;

    accountTimelineCommentDTO: any;
    updAccountTimelineCommentDTO: any;
    accountTimelineCommentSchema: any;


    groups: any[];

    accountDTO: any;
    updAccountDTO: any;
    accountsSchema: any;

    account: any;

    ownerOfProfile = false;
    areAccountGroupMembers = false;
    showFullProfile = false;

    showAvatarEditor = false;
    avatarChangedEvent: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     */
    constructor(
        private _auth: AuthTokenSessionService,
        public fn: CommonFn,
        private _profileService: AccountProfileService,
        private _accountService: AccountsService,
        private router: Router
    ) {
        this.account = this._accountService.account;
        this.canDev = this._auth.canDev(ModuleCodeEnum.Maintenance);
        this.accountTimelineDTO = this._profileService.accountTimelineDTO;
        this.postDTO = this._profileService.postDTO;
        this.updPostDTO = this._profileService.updPostDTO;
        this.postSchema = this._profileService.postSchema;
        this.postMediaDTO = this._profileService.postMediaDTO;
        this.postMediaSchema = this._profileService.postMediaSchema;
        this.accountTimelineCommentDTO = this._profileService.accountTimelineCommentDTO;
        this.updAccountTimelineCommentDTO = this._profileService.updAccountTimelineCommentDTO;
        this.accountTimelineCommentSchema = this._profileService.accountTimelineCommentSchema;
        this.accountDTO = this._profileService.accountDTO;
        this.updAccountDTO = this._profileService.updAccountDTO;
        this.accountsSchema = this._profileService.accountsSchema;

        this.account = this._profileService.account;

        this.ownerOfProfile = this._profileService.ownerOfProfile;
        this.areAccountGroupMembers = this._profileService.areAccountGroupMembers;
        this.showFullProfile = this._profileService.showFullProfile;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._profileService.accountTimelineDTOOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((accountTimelineDTO) => {
                this.accountTimelineDTO = accountTimelineDTO;
            });
        this._profileService.postDTOOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((postDTO) => {
                this.postDTO = postDTO;
            });
        this._profileService.updPostDTOOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((updPostDTO) => {
                this.updPostDTO = updPostDTO;
            });
        this._profileService.postSchemaOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((postSchema) => {
                this.postSchema = postSchema;
            });
        this._profileService.postMediaDTOOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((postMediaDTO) => {
                this.postMediaDTO = postMediaDTO;
            });
        this._profileService.postMediaSchemaOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((postMediaSchema) => {
                this.postMediaSchema = postMediaSchema;
            });
        this._profileService.accountTimelineCommentDTOOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((accountTimelineCommentDTO) => {
                this.accountTimelineCommentDTO = accountTimelineCommentDTO;
            });
        this._profileService.updAccountTimelineCommentDTOOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((updAccountTimelineCommentDTO) => {
                this.updAccountTimelineCommentDTO = updAccountTimelineCommentDTO;
            });
        this._profileService.accountTimelineCommentSchemaOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((accountTimelineCommentSchema) => {
                this.accountTimelineCommentSchema = accountTimelineCommentSchema;
            });

        this._profileService.accountDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((accountDTO) => {
            this.accountDTO = accountDTO;
        });
        this._profileService.updAccountDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((updAccountDTO) => {
            this.updAccountDTO = updAccountDTO;
        });
        this._profileService.accountSchemaOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((accountsSchema) => {
            this.accountsSchema = accountsSchema;
        });

        this._profileService.accountOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((account) => {
            this.account = account;
            this.areAccountGroupMembers = this._profileService.areAccountGroupMembers;
            this.showFullProfile = this._profileService.showFullProfile;
        });
        this._profileService.ownerOfProfileOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((ownerOfProfile) => {
            this.ownerOfProfile = ownerOfProfile;
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    isAuth(): boolean {
        return this._auth.isLoggedIn();
    }
    doMaintain(): void {
        this.router.navigateByUrl('maintain/profile');
    }

    doMaintainAccount(account: any): void {
        this._profileService.getFullAccountData().then(() => {
            this.router.navigateByUrl('maintain/account-profile');
        });
    }


    fileChangeEvent(event: any): void {
        this.avatarChangedEvent = event;
        this.showAvatarEditor = !this.showAvatarEditor;
    }

    avatarCropped(event: CroppedEvent): void {
        this.fn.toAvatarDataURL(event.base64).then((avatar) => {
            this._profileService
                .updateAccountAvatar(this.account.id, avatar)
                .then(() => {
                    if (this.myUploadAvatarFileInput) {
                        this.myUploadAvatarFileInput.nativeElement.value = '';
                    }
                    this.showAvatarEditor = false;
                })
                .catch(() => {});
        });
    }
    refreshPhotos(): void {
        this._profileService._mediaService.getPhotosVideos();
    }
}
