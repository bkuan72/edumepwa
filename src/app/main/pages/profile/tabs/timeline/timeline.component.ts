import { Contact } from 'app/main/apps/contacts/contact.model';
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
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { ActivityService } from 'app/services/activity/activity.service';
import { MemberContactsService } from 'app/main/apps/members/member-contacts.service';

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
                private _contactService: ContactsService,
                private _memberContactService: MemberContactsService,
                private _activityService: ActivityService,
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
        this.canComment = this._profileService.showFullProfile;
        this.canPost = this._profileService.showFullProfile;
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
            this.canPost = this._profileService.showFullProfile;
            this.canComment = this._profileService.showFullProfile;
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
        let newContact = new Contact({
            user_id: this.authUser.id,
            friend_id: activity.user_id,
            friend_status: 'OK'
        });
        this._profileService.getUserData(activity.user_id).then((userData) => {
            newContact = this.fn.mapValueToObj(newContact, userData, ['id']);
            this._contactService.updateContact(newContact).then(() => {
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
        this._profileService._userAccountGroupCache.getBasicUserData(activity.user_id).then((userData) => {
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


    acceptAccountMemberReq(activity: any): void {
        let newContact = new Contact({
            user_id: this.authUser.id,
            account_id: activity.account_id,
            friend_status: 'OK'
        });
        this._memberContactService.updateContactMemberStatusOk(activity.member_id).then(() => { 
            this._profileService._userAccountGroupCache.getAccountData(activity.account_id).then((accountData) => {
                newContact = this.fn.mapValueToObj(newContact, accountData, ['id']);
                this._contactService.updateContact(newContact).then(() => {
                    this._activityService.deleteActivity(activity.id).finally(() => {
                        this._profileService.getActivities();
                    });
                });
            });
        });
    }

    ignoreAccountMemberReq(activity: any): void {
        this._activityService.deleteActivity(activity.id).finally(() => {
            this._profileService.getActivities();
        });
    }


    blockAccount(activity: any): void {
        const blockContact = new Contact({
            user_id: this.authUser.id,
            account_id: activity.account_id,
            friend_status: 'BLOCKED'
        });
        this._profileService._userAccountGroupCache.getBasicAccountData(activity.account_id).then((accountData) => {
            blockContact.first_name = accountData.account_name;
            blockContact.avatar = accountData.avatar;
            this._contactService.updateContact(blockContact).then(() => {
                this._activityService.deleteActivity(activity.id).finally(() => {
                    this._profileService.getActivities();
                });
            });
        });

    }


    acceptGroupMemberReq(activity: any): void {
        let newContact = new Contact({
            user_id: this.authUser.id,
            group_id: activity.group_id,
            friend_status: 'OK'
        });
        this._memberContactService.updateContactMemberStatusOk(activity.member_id).then(() => {
            this._profileService._userAccountGroupCache.getGroupData(activity.group_id).then((groupData) => {
                newContact = this.fn.mapValueToObj(newContact, groupData, ['id']);
                newContact.first_name = groupData.group_name;
                this._contactService.updateContact(newContact).then(() => {
                    this._activityService.deleteActivity(activity.id).finally(() => {
                        this._profileService.getActivities();
                    });
                });
            });
        });
    }

    ignoreGroupMemberReq(activity: any): void {
        this._activityService.deleteActivity(activity.id).finally(() => {
            this._profileService.getActivities();
        });
    }

    blockGroup(activity: any): void {
        const blockContact = new Contact({
            user_id: this.authUser.id,
            group_id: activity.group_id,
            friend_status: 'BLOCKED'
        });
        this._profileService._userAccountGroupCache.getBasicGroupData(activity.group_id).then((groupData) => {
            blockContact.first_name = groupData.account_name;
            blockContact.avatar = groupData.avatar;
            this._contactService.updateContact(blockContact).then(() => {
                this._activityService.deleteActivity(activity.id).finally(() => {
                    this._profileService.getActivities();
                });
            });
        });

    }
}
