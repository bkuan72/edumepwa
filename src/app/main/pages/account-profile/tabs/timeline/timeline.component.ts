import { Contact } from 'app/main/apps/contacts/contact.model';
import { AlertService } from 'app/services/alert/alert.service';
import { CommonFn } from '../../../../../shared/common-fn';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

import { AccountProfileService } from '../../account-profile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountTimelinePostIfc, AccountTimelineService } from '../../account-timeline.service';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { CroppedEvent, NgxPhotoEditorComponent } from 'ngx-photo-editor';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { ActivityService } from 'app/services/activity/activity.service';

@Component({
    selector: 'profile-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ProfileTimelineComponent implements OnInit, OnDestroy {
    @ViewChild('uploadPostImageFileInput') myUploadPostImageFileInput: ElementRef;
    post: AccountTimelinePostIfc;
    accountTimeline: any[];
    activities: any[];
    members: any[];
    authUser: any;

    account: any;
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
    constructor(private _profileService: AccountProfileService,
                private _timelineService: AccountTimelineService,
                public _auth: AuthTokenSessionService,
                private _contactService: ContactsService,
                private _activityService: ActivityService,
                public fn: CommonFn,
                private alert: AlertService) {
        this.post = {
            post_user_id: '',
            timeline_account_id: '',
            message: '',
            medias: [],
            location: { lat: 0, lng: 0 },
            comment: ''
        };
        this.accountTimeline = [];
        this.activities = [];
        this.members = [];
        this.ownerOfProfile = false;

        this.account = this._profileService.account;
        this.canComment = this._profileService.showFullProfile;
        this.canPost = this._profileService.showFullProfile;
        this.ownerOfProfile = this._profileService.ownerOfProfile;

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

        this._profileService.accountTimelineOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((accountTimeline) => {
                this.accountTimeline = accountTimeline;
                // this.doUpdateTimeLineUser();
            });
        this._profileService.activitiesOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((activities) => {
                this.activities = activities;
            });
        this._profileService.membersOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((members) => {
                this.members = members;
                // this.doUpdateTimeLineUser();
            });
        this._auth.authUserOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((authUser) => {
            this.authUser = authUser;
        });
        this._profileService.accountOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((account) => {
            this.account = account;
            this.ownerOfProfile = this._profileService.ownerOfProfile;
            this.canPost = this._profileService.showFullProfile;
            this.canComment = this._profileService.showFullProfile;
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
            this._profileService.doLoadAccountProfile();

        }
        this.isPostEmojiPickerVisible = false;

        this.post.message = this.post.message.trim();
        if (this.post.message.length > 0 ||
            this.post.medias.length > 0) {
            this.post.timeline_account_id = this._profileService.account.id;
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
            this._profileService.account.id,
            this._auth.currentAuthUser.id,
            timeline.id
        )
        .then(() => {
            this._profileService.doLoadAccountProfile();
        })
        .catch(() => {
        });

    }



    fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
      this.showImageEditor = !this.showImageEditor;
    }

    imageCropped(event: CroppedEvent): void {
        this.fn.resizeImage (event.base64, 1024, 512).then((resizedImg) => {
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

    acceptFriend(activity: any): void {
        let blockContact = new Contact({
            user_id: this.authUser.id,
            friend_id: activity.user_id,
            friend_status: 'OK'
        });
        this._profileService.getUserData(activity.user_id).then((userData) => {
            blockContact = this.fn.mapValueToObj(blockContact, userData, ['id']);
            this._contactService.updateContact(blockContact).then(() => {
                this._activityService.deleteActivity(activity.id).finally(() => {
                    this._profileService.getActivities();
                });
            });
        });
    }

    ignoreFriend(activity: any): void {
        this._activityService.deleteActivity(activity.id).finally(() => {
            this._profileService.getActivities();
        });
    }

    blockFriend(activity: any): void {
        const blockContact = new Contact({
            user_id: this.authUser.id,
            friend_id: activity.user_id,
            friend_status: 'BLOCKED'
        });
        this._profileService.getBasicUserData(activity.user_id).then((userData) => {
            blockContact.first_name = userData.first_name;
            blockContact.last_name = userData.last_name;
            blockContact.avatar = userData.avatar;
            this._contactService.updateContact(blockContact).then(() => {
                this._activityService.deleteActivity(activity.id).finally(() => {
                    this._profileService.getActivities();
                });
            });
        });

    }
}
