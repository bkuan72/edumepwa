import { CommonFn } from './../../../../../shared/common-fn';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

import { ProfileService } from '../../profile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TimelinePostIfc, TimelineService } from '../../timeline.service';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';

@Component({
    selector: 'profile-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ProfileTimelineComponent implements OnInit, OnDestroy {
    currentUser: any;
    post: TimelinePostIfc;
    userTimeline: any[];
    activities: any[];
    friends: any[];

    commentSubmitted = false;

    public isPostEmojiPickerVisible: boolean;
    public isCommentEmojiPickerVisible: boolean;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ProfileService} _profileService
     */
    constructor(private _profileService: ProfileService,
                private _timelineService: TimelineService,
                private _auth: AuthTokenSessionService,
                public fn: CommonFn) {
        this.currentUser = this._auth.userValue;
        this.post = {
            post_user_id: '',
            timeline_user_id: '',
            message: '',
            medias: [],
            location: { lat: 0, lng: 0 },
            comment: ''
        };
        this.userTimeline = [];
        this.activities = [];
        this.friends = [];
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this._profileService.userTimelineOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((userTimeline) => {
                this.userTimeline = userTimeline;
                // this.doUpdateTimeLineUser();
            });
        this._profileService.activitiesOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((activities) => {
                this.activities = activities;
            });
        this._profileService.friendsOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((friends) => {
                this.friends = friends;
                // this.doUpdateTimeLineUser();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    public addPostEmoji(event: any): void {
        this.post.message = `${this.post.message}${event.emoji.native}`;
     }

    isAuth(): boolean {
        return this._auth.isLoggedIn();
    }


    /**
     * To allow tracking of array to prevent regeneration of html for the array element that has not changed
     * in the array
     * @param index - array idx
     * @param item  - array item
     */
    trackByUuid(index: number, item: any): string {
        return item.id;
    }
    /**
     * Post message on timeline
     */
    doPostMessage(): void {
        this.isPostEmojiPickerVisible = false;

        this.post.message = this.post.message.trim();
        if (this.post.message.length > 0) {
            this.post.timeline_user_id = this._profileService.user.id;
            this.post.post_user_id = this._auth.userValue.id;
            this._timelineService.doPostToTimeline(this.post)
            .then(() => {
                this.post.message = '';
                this._profileService.doLoadUserProfile();
            })
            .catch(() => {
            });

        }
    }

    emptyComment(timeline: any): boolean {
        if (timeline.newComment && timeline.newComment !== '') {
            return false;
        }
        return true;
    }

    public addCommentEmoji(timeline: any, event: any): void {
        timeline.newComment = `${timeline.newComment}${event.emoji.native}`;
     }
    public toggleCommentEmojiPicker(timeline: any): void {
        timeline.isCommentEmojiPickerVisible = !timeline.isCommentEmojiPickerVisible;
    }

    public emojiPickerVisible(timeline: any): boolean {
        return timeline.isCommentEmojiPickerVisible;
    }

    /**
     * Post message on timeline
     */
    doPostComments(timeline: any): void {
        if (this.commentSubmitted) {
            return;
        }
        this.commentSubmitted = true;
        timeline.isCommentEmojiPickerVisible = false;

        // stop here if form is invalid
        if (this.emptyComment(timeline)) {
            return;
        }

        this._timelineService.doPostCommentToTimeline(
            this._auth.userValue.id,
            timeline.id,
            timeline.post.id,
            timeline.newComment
        )
        .then(() => {
            timeline.newComment = '';
            this._profileService.doLoadUserProfile();
            this.commentSubmitted = false;
        })
        .catch(() => {
            this.commentSubmitted = false;
        });

    }

    /**
     * Toggle timeline like
     */
    doToggleTimelineLike(timeline: any): void {

        this._timelineService.doToggleTimelineLike(
            this._profileService.user.id,
            this.currentUser.id,
            timeline.id
        )
        .then(() => {
            this._profileService.doLoadUserProfile();
        })
        .catch(() => {
        });

    }

}
