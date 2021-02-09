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

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ProfileComponent implements OnInit, OnDestroy {
    @ViewChild('uploadAvatarFileInput') myUploadAvatarFileInput: ElementRef;
    userTimelineDTO: any;
    postDTO: any;
    updPostDTO: any;
    postSchema: any;
    postMediaDTO: any;
    postMediaSchema: any;
    userTimelineCommentDTO: any;
    updUserTimelineCommentDTO: any;
    userTimelineCommentSchema: any;

    user: any;
    ownerOfProfile: boolean;

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
        this.userTimelineDTO = this._profileService.userTimelineDTO;
        this.postDTO = this._profileService.postDTO;
        this.updPostDTO = this._profileService.updPostDTO;
        this.postSchema = this._profileService.postSchema;
        this.postMediaDTO = this._profileService.postMediaDTO;
        this.postMediaSchema = this._profileService.postMediaSchema;
        this.userTimelineCommentDTO = this._profileService.userTimelineCommentDTO;
        this.updUserTimelineCommentDTO = this._profileService.updUserTimelineCommentDTO;
        this.userTimelineCommentSchema = this._profileService.userTimelineCommentSchema;
        this.user = this._profileService.user;
        this.ownerOfProfile = false;
        if (
            this._auth.currentAuthUser &&
            this._auth.currentAuthUser.id === this.user.id
        ) {
            this.ownerOfProfile = true;
        }
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
}
