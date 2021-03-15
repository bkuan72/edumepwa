import { AlertService } from 'app/services/alert/alert.service';
import { CommonFn } from './../../../../../shared/common-fn';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

import { ProfileService } from '../../profile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TimelinePostIfc, TimelineService } from '../../timeline.service';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { CroppedEvent, NgxPhotoEditorComponent } from 'ngx-photo-editor';

@Component({
    selector: 'profile-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ProfileTimelineComponent implements OnInit, OnDestroy {
    @ViewChild('uploadPostImageFileInput') myUploadPostImageFileInput: ElementRef;
    post: TimelinePostIfc;
    userTimeline: any[];
    activities: any[];
    friends: any[];
    authUser: any;

    user: any;
    ownerOfProfile = false;
    commentSubmitted = false;

    canPost = false;
    canComment = false;

    public isPostEmojiPickerVisible: boolean;
    public isCommentEmojiPickerVisible: boolean;

    showImageEditor = false;
    imageChangedEvent: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ProfileService} _profileService
     */
    constructor(private _profileService: ProfileService,
                private _timelineService: TimelineService,
                public _auth: AuthTokenSessionService,
                public fn: CommonFn,
                private alert: AlertService) {
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
        this.ownerOfProfile = false;

        this.user = this._profileService.user;
        this.canComment = this._profileService.isFriend(this.user.id);
        this.canPost = this._profileService.isFriend(this.user.id);
        if (
            this._auth.currentAuthUser &&
            this._auth.currentAuthUser.id === this.user.id
        ) {
            this.ownerOfProfile = true;
            this.canPost = true;
            this.canComment = true;
        }

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
        this._auth.authUserOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((authUser) => {
            this.authUser = authUser;
        });
        this._profileService.userOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((user) => {
            this.user = user;
            this.ownerOfProfile = false;
            this.canPost = this._profileService.isFriend(user.id);
            this.canComment = this._profileService.isFriend(user.id);
            if (
                this._auth.currentAuthUser &&
                this._auth.currentAuthUser.id === this.user.id
            ) {
                this.ownerOfProfile = true;
                this.canPost = true;
                this.canComment = true;
            }
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
        if (item !== null) {
            return item.id;
        } else {
            return '';
        }
    }
    /**
     * Post message on timeline
     */
    doPostMessage(): void {

        const doTidyUp = () => {
            if (this.myUploadPostImageFileInput) {
                this.myUploadPostImageFileInput.nativeElement.value = '';
            }
            this.post.medias = [];
            this.post.message = '';
            this.isPostEmojiPickerVisible = false;
            this._profileService.doLoadUserProfile();

        }
        this.isPostEmojiPickerVisible = false;

        this.post.message = this.post.message.trim();
        if (this.post.message.length > 0 ||
            this.post.medias.length > 0) {
            this.post.timeline_user_id = this._profileService.user.id;
            this.post.post_user_id = this._auth.currentAuthUser.id;
            this._timelineService.doPostToTimeline(this.post)
            .then((postDTO) => {
                const promiseList: Promise<any>[] = [];
                this.post.medias.forEach((media) => {
                    promiseList.push(this._timelineService.doPostMedia(this._auth.currentAuthUser.id,
                        postDTO.id,
                        media));
                });

                if (promiseList.length === 0) {
                    doTidyUp();
                } else {
                    Promise.all(promiseList).finally (() => {
                        doTidyUp();
                    })
                }
            })
            .catch(() => {
            });

        }
    }

    emptyComment(timeline: any): boolean {
        if (timeline.newComment && 
            timeline.newComment !== '') {
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
        timeline.isCommentEmojiPickerVisible  = false;

        // stop here if form is invalid
        if (this.emptyComment(timeline)) {
            return;
        }

        this._timelineService.doPostCommentToTimeline(
            this._auth.currentAuthUser.id,
            timeline.id,
            timeline.post.id,
            timeline.newComment
        )
        .then(() => {
            timeline.newComment = '';
            this._profileService.doGetPostComments(timeline);
            this._profileService.getActivities();
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
            this._auth.currentAuthUser.id,
            timeline.id
        )
        .then(() => {
            this._profileService.doLoadUserProfile();
        })
        .catch(() => {
        });

    }



    fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
      this.showImageEditor = !this.showImageEditor;
    }

    imageCropped(event: CroppedEvent): void {
        this.fn.resizeImage (event.base64, 0.15, 128).then((resizedImg) => {
            const picture = {
                type: 'image',
                preview: resizedImg
            };
            if (this.post.medias.length > 0) {
              this.post.medias[0] = picture;
            } else {
              this.post.medias.push(picture);
            }
            this.showImageEditor = false;
        });
    }
    imageLoadFail(): void {
        this.alert.error('Invalid Image File');
    }
}
