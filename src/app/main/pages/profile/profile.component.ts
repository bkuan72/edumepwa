import { AccountsService } from 'app/services/account/account.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonFn } from './../../../shared/common-fn';
import {
    Component,
    ViewEncapsulation,
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef,
} from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { ProfileService } from './profile.service';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { Subject } from 'rxjs';
import { CroppedEvent } from 'ngx-photo-editor';
import { ModuleCodeEnum } from 'app/shared/module-code-enum';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ProfileComponent implements OnInit, OnDestroy {
    @ViewChild('uploadAvatarFileInput') myUploadAvatarFileInput: ElementRef;
    panelOpenState = false;
    canAddAccount: boolean;
    canEditAccount: boolean;
    canDev: boolean;
    userTimelineDTO: any;
    postDTO: any;
    updPostDTO: any;
    postSchema: any;
    postMediaDTO: any;
    postMediaSchema: any;

    userTimelineCommentDTO: any;
    updUserTimelineCommentDTO: any;
    userTimelineCommentSchema: any;

    accounts: any[];

    accountDTO: any;
    updAccountDTO: any;
    accountsSchema: any;

    userDTO: any;
    updUserDTO: any;
    usersSchema: any;

    userAccountDTO: any;
    updUserAccountDTO: any;
    userAccountsSchema: any;
    userAccountDataDTO: any;

    user: any;
    userFullData: any;
    ownerOfProfile = false;
    areFriends = false;
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
        private _profileService: ProfileService,
        private router: Router
    ) {
        this.canDev = this._auth.canDev(ModuleCodeEnum.Maintenance);
        this.canAddAccount = this._auth.canAdd(ModuleCodeEnum.Account);
        this.canEditAccount = this._auth.canEdit(ModuleCodeEnum.Account);
        this.userTimelineDTO = this._profileService.userTimelineDTO;
        this.postDTO = this._profileService.postDTO;
        this.updPostDTO = this._profileService.updPostDTO;
        this.postSchema = this._profileService.postSchema;
        this.postMediaDTO = this._profileService.postMediaDTO;
        this.postMediaSchema = this._profileService.postMediaSchema;
        this.userTimelineCommentDTO = this._profileService.userTimelineCommentDTO;
        this.updUserTimelineCommentDTO = this._profileService.updUserTimelineCommentDTO;
        this.userTimelineCommentSchema = this._profileService.userTimelineCommentSchema;
        this.accountDTO = this._profileService.accountDTO;
        this.updAccountDTO = this._profileService.updAccountDTO;
        this.accountsSchema = this._profileService.accountsSchema;

        this.userDTO = this._profileService.userDTO;
        this.updUserDTO = this._profileService.updUserDTO;
        this.usersSchema = this._profileService.usersSchema;

        this.userAccountDTO = this._profileService.userAccountDTO;
        this.updUserAccountDTO = this._profileService.updUserAccountDTO;
        this.userAccountsSchema = this._profileService.userAccountsSchema;

        this.userAccountDataDTO = this._profileService.userAccountDataDTO;

        this.user = this._profileService.user;
        this.ownerOfProfile = false;
        if (
            this._auth.currentAuthUser &&
            this._auth.currentAuthUser.id === this.user.id
        ) {
            this.ownerOfProfile = true;
        }
        this.areFriends = this._profileService.areFriends;
        this.showFullProfile = this._profileService.showFullProfile;
        this.accounts = this._profileService.accounts;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._profileService.userTimelineDTOOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((userTimelineDTO) => {
                this.userTimelineDTO = userTimelineDTO;
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
        this._profileService.userTimelineCommentDTOOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((userTimelineCommentDTO) => {
                this.userTimelineCommentDTO = userTimelineCommentDTO;
            });
        this._profileService.updUserTimelineCommentDTOOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((updUserTimelineCommentDTO) => {
                this.updUserTimelineCommentDTO = updUserTimelineCommentDTO;
            });
        this._profileService.userTimelineCommentSchemaOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((userTimelineCommentSchema) => {
                this.userTimelineCommentSchema = userTimelineCommentSchema;
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

        this._profileService.userDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((userDTO) => {
            this.userDTO = userDTO;
        });
        this._profileService.updUserDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((updUserDTO) => {
            this.updUserDTO = updUserDTO;
        });
        this._profileService.usersSchemaOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((usersSchema) => {
            this.usersSchema = usersSchema;
        });

        this._profileService.userAccountDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((userAccountDTO) => {
            this.userAccountDTO = userAccountDTO;
        });
        this._profileService.updUserAccountDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((updUserAccountDTO) => {
            this.updUserAccountDTO = updUserAccountDTO;
        });
        this._profileService.userAccountSchemaOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((userAccountsSchema) => {
            this.userAccountsSchema = userAccountsSchema;
        });

        this._profileService.userAccountDataDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((userAccountDataDTO) => {
            this.userAccountDataDTO = userAccountDataDTO;
        });
        this._profileService.accountsOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((accounts) => {
            this.accounts = accounts;
        });
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
            this.areFriends = this._profileService.areFriends;
            this.showFullProfile = this._profileService.showFullProfile;
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
        this._profileService._accountService.getAccountById(account.account_id).then(() => {
            this._profileService.getFullUserData().then(() => {
                this.router.navigateByUrl('maintain/account-profile');
            });
        });
    }

    doViewAccountProfile(account: any): void {
        this._profileService._accountProfileSession.goToAccountProfile(account.account_id);
    }

    addNewAccount(): void {
        this._profileService.getFullUserData().then(() => {
            this._profileService._accountService.initNewAccount(this.user.id).then(() => {
                this.router.navigateByUrl('maintain/account-profile');
            }).catch(() => {});
        }).catch(() => {});
    }

    fileChangeEvent(event: any): void {
        this.avatarChangedEvent = event;
        this.showAvatarEditor = !this.showAvatarEditor;
    }

    avatarCropped(event: CroppedEvent): void {
        this.fn.toAvatarDataURL(event.base64).then((avatar) => {
            this._profileService
                .updateUserAvatar(this.user.id, avatar)
                .then(() => {
                    if (this.myUploadAvatarFileInput) {
                        this.myUploadAvatarFileInput.nativeElement.value = '';
                    }
                    this.showAvatarEditor = false;
                    this._auth.setAuthUserAvatar(avatar);
                })
                .catch(() => {});
        });
    }
    refreshPhotos(): void {
        this._profileService._mediaService.getPhotosVideos();
    }
}
