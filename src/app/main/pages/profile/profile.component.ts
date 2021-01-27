import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonFn } from './../../../shared/common-fn';
import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { ProfileService } from './profile.service';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ProfileComponent implements OnInit, OnDestroy{
    userTimelineDTO: any;
    postDTO: any;
    updPostDTO: any;
    postSchema: any;
    userTimelineCommentDTO: any;
    updUserTimelineCommentDTO: any;
    userTimelineCommentSchema: any;

    user: any;
    allowFollow: boolean;

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
        this.userTimelineCommentDTO = this._profileService.userTimelineCommentDTO;
        this.updUserTimelineCommentDTO = this._profileService.updUserTimelineCommentDTO;
        this.userTimelineCommentSchema = this._profileService.userTimelineCommentSchema;
        this.user = this._profileService.user;
        this.allowFollow = true;
        if (this._auth.userValue &&
            this._auth.userValue.id === this.user.id) {
                this.allowFollow = false;
            }
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._profileService.userTimelineDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(userTimelineDTO => {
            this.userTimelineDTO = userTimelineDTO;
        });
        this._profileService.postDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(postDTO => {
            this.postDTO = postDTO;
        });
        this._profileService.updPostDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(updPostDTO => {
            this.updPostDTO = updPostDTO;
        });
        this._profileService.postSchemaOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(postSchema => {
            this.postSchema = postSchema;
        });
        this._profileService.userTimelineCommentDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(userTimelineCommentDTO => {
            this.userTimelineCommentDTO = userTimelineCommentDTO;
        });
        this._profileService.updUserTimelineCommentDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(updUserTimelineCommentDTO => {
            this.updUserTimelineCommentDTO = updUserTimelineCommentDTO;
        });
        this._profileService.userTimelineCommentSchemaOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(userTimelineCommentSchema => {
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
        this.router.navigateByUrl('pages/forms/user-profile-maintenance-forms');
    }
}
