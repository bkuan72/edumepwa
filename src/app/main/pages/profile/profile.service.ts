import { takeUntil } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SrvHttpService } from 'app/services/http-connect/srv-http.service';
import { SrvApiEnvEnum } from 'app/shared/SrvApiEnvEnum';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import * as moment from 'moment';
import { AccountsService } from 'app/services/account/account.service';
import { UserProfileSessionService } from 'app/services/session/user-profile-session.service';
import { MediaService, UploadMode } from 'app/services/media/media.service';
import { LoggerService } from 'app/services/logger/logger.service';
import { CommonFn } from 'app/shared/common-fn';
import { ActivityService } from 'app/services/activity/activity.service';
import { AccountProfileSessionService } from 'app/services/session/account-profile-session.service';
import { UserAccountGroupCacheService } from 'app/services/user-account-group-cache/user-account-group-cache.service';

@Injectable()
export class ProfileService implements Resolve<any>, OnDestroy {
    profileType = 'USER';
    userDTO: any;
    updUserDTO: any;
    insUserDTO: any;
    usersSchema: any;
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
    userFullData: any;
    userBasicData: any;
    areFriends = false;
    ownerOfProfile = false;
    showFullProfile = false;
    userTimeline: any[];
    about: any;
    photosVideos: any[];

    accounts: any[];

    userAccountDTO: any;
    updUserAccountDTO: any;
    userAccountsSchema: any;

    userAccountDataDTO: any;

    accountDTO: any;
    updAccountDTO: any;
    accountsSchema: any;

    activities: any[];
    friends: any[];
    strangers: any[];
    groups: any[];
    countries: any[];
    titles: any[];
    postMedias: any[];

    userOnChanged: BehaviorSubject<any>;
    accountsOnChanged: BehaviorSubject<any>;

    accountDTOOnChanged: BehaviorSubject<any>;
    updAccountDTOOnChanged: BehaviorSubject<any>;
    accountSchemaOnChanged: BehaviorSubject<any>;

    userAccountDTOOnChanged: BehaviorSubject<any>;
    updUserAccountDTOOnChanged: BehaviorSubject<any>;
    userAccountSchemaOnChanged: BehaviorSubject<any>;

    userAccountDataDTOOnChanged: BehaviorSubject<any>;

    userTimelineOnChanged: BehaviorSubject<any>;
    aboutOnChanged: BehaviorSubject<any>;
    photosVideosOnChanged: BehaviorSubject<any>;
    activitiesOnChanged: BehaviorSubject<any>;
    friendsOnChanged: BehaviorSubject<any>;
    groupsOnChanged: BehaviorSubject<any>;
    userDTOOnChanged: BehaviorSubject<any>;
    updUserDTOOnChanged: BehaviorSubject<any>;
    insUserDTOOnChanged: BehaviorSubject<any>;
    usersSchemaOnChanged: BehaviorSubject<any>;
    countriesOnChanged: BehaviorSubject<any>;
    userBasicDataOnChanged: BehaviorSubject<any>;
    userFullDataOnChanged: BehaviorSubject<any>;
    titlesOnChanged: BehaviorSubject<any>;
    userTimelineDTOOnChanged: BehaviorSubject<any>;

    postDTOOnChanged: BehaviorSubject<any>;
    updPostDTOOnChanged: BehaviorSubject<any>;
    postSchemaOnChanged: BehaviorSubject<any>;
    postMediaDTOOnChanged: BehaviorSubject<any>;
    postMediaSchemaOnChanged: BehaviorSubject<any>;

    userTimelineCommentDTOOnChanged: BehaviorSubject<any>;
    updUserTimelineCommentDTOOnChanged: BehaviorSubject<any>;
    userTimelineCommentSchemaOnChanged: BehaviorSubject<any>;
    _mediaService: MediaService;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _http
     */
    constructor(
        private _http: SrvHttpService,
        private _userProfileSession: UserProfileSessionService,
        public _accountProfileSession: AccountProfileSessionService,
        private _authTokenSession: AuthTokenSessionService,
        public _accountService: AccountsService,
        public _userAccountGroupCache: UserAccountGroupCacheService,
        private _logger: LoggerService,
        private _activities: ActivityService,
        private _fn: CommonFn
    ) {
        this._mediaService = new MediaService(
            this._logger,
            this._http,
            this._authTokenSession,
            this._fn,
            UploadMode.UserMedia
        );
        this.user = this._userProfileSession.userProfileValue;
        this.ownerOfProfile =
            this.user.id === this._authTokenSession.currentAuthUser.id;
        this.userBasicData = undefined;
        this.userFullData = undefined;
        this.userTimeline = [];
        this.about = {};
        this.photosVideos = [];
        this.activities = [];
        this.friends = [];
        this.strangers = [];
        this.groups = [];
        this.countries = [];
        this.titles = [];
        this.postMedias = [];
        this.accounts = [];
        this._mediaService.initMediaService(
            UploadMode.UserMedia,
            this.user,
            undefined,
            undefined
        );
        // Set the defaults
        this.userOnChanged = new BehaviorSubject(this.user);
        this.accountsOnChanged = new BehaviorSubject(
            this._accountService.accounts
        );

        this.accountDTOOnChanged = new BehaviorSubject(
            this._accountService.accountsDTO
        );
        this.updAccountDTOOnChanged = new BehaviorSubject(
            this._accountService.accountsUpdDTO
        );
        this.accountSchemaOnChanged = new BehaviorSubject(
            this._accountService.accountsSchema
        );

        this.userAccountDTOOnChanged = new BehaviorSubject(
            this._accountService.userAccountsDTO
        );
        this.updUserAccountDTOOnChanged = new BehaviorSubject(
            this._accountService.userAccountsUpdDTO
        );
        this.userAccountSchemaOnChanged = new BehaviorSubject(
            this._accountService.userAccountsSchema
        );

        this.userAccountDataDTOOnChanged = new BehaviorSubject(
            this._accountService.userAccountsDataDTO
        );

        this.userTimelineOnChanged = new BehaviorSubject(this.userTimeline);
        this.aboutOnChanged = new BehaviorSubject(this.about);
        this.photosVideosOnChanged = new BehaviorSubject(this.photosVideos);
        this.activitiesOnChanged = new BehaviorSubject(this.activities);
        this.friendsOnChanged = new BehaviorSubject(this.friends);
        this.groupsOnChanged = new BehaviorSubject(this.groups);
        this.userDTOOnChanged = new BehaviorSubject(this.userDTO);
        this.updUserDTOOnChanged = new BehaviorSubject(this.updUserDTO);
        this.insUserDTOOnChanged = new BehaviorSubject(this.insUserDTO);
        this.usersSchemaOnChanged = new BehaviorSubject(this.usersSchema);
        this.countriesOnChanged = new BehaviorSubject(this.countries);
        this.titlesOnChanged = new BehaviorSubject(this.titles);
        this.userBasicDataOnChanged = new BehaviorSubject(this.userBasicData);
        this.userFullDataOnChanged = new BehaviorSubject(this.userFullData);

        this.userTimelineDTOOnChanged = new BehaviorSubject(
            this.userTimelineDTO
        );
        this.postDTOOnChanged = new BehaviorSubject(this.postDTO);
        this.updPostDTOOnChanged = new BehaviorSubject(this.updPostDTO);
        this.postSchemaOnChanged = new BehaviorSubject(this.postSchema);
        this.postMediaDTOOnChanged = new BehaviorSubject(this.postMediaDTO);
        this.postMediaSchemaOnChanged = new BehaviorSubject(
            this.postMediaSchema
        );
        this.userTimelineCommentDTOOnChanged = new BehaviorSubject(
            this.userTimelineCommentDTO
        );
        this.updUserTimelineCommentDTOOnChanged = new BehaviorSubject(
            this.updUserTimelineCommentDTO
        );
        this.userTimelineCommentSchemaOnChanged = new BehaviorSubject(
            this.userTimelineCommentSchema
        );

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this._userProfileSession.userProfileOnChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user) => {
                this.user = user;
                this._mediaService.initMediaService(
                    UploadMode.UserMedia,
                    this.user,
                    undefined,
                    undefined
                );
                this.ownerOfProfile =
                    this.user.id === this._authTokenSession.currentAuthUser.id;
                this.doCheckAreFriends().finally(() => {
                    this.doLoadUserProfile().then(() => {
                        this.userOnChanged.next(this.user);
                    });
                });
            });
        this._accountService.accountsOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((accounts) => {
                this.accounts = accounts;
                this.accountsOnChanged.next(this.accounts);
            });
        this._accountService.accountsDTOOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((accountDTO) => {
                this.accountDTO = accountDTO;
                this.accountDTOOnChanged.next(this.accountDTO);
            });
        this._accountService.accountsUpdDTOOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((updAccountDTO) => {
                this.updAccountDTO = updAccountDTO;
                this.updAccountDTOOnChanged.next(this.updAccountDTO);
            });
        this._accountService.accountsSchemaOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((accountsSchema) => {
                this.accountsSchema = accountsSchema;
                this.accountSchemaOnChanged.next(this.accountsSchema);
            });

        this._accountService.userAccountsDTOOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((userAccountDTO) => {
                this.userAccountDTO = userAccountDTO;
                this.userAccountDTOOnChanged.next(this.userAccountDTO);
            });
        this._accountService.userAccountsUpdDTOOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((updUserAccountDTO) => {
                this.updUserAccountDTO = updUserAccountDTO;
                this.updUserAccountDTOOnChanged.next(this.updUserAccountDTO);
            });
        this._accountService.userAccountsSchemaOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((userAccountsSchema) => {
                this.userAccountsSchema = userAccountsSchema;
                this.userAccountSchemaOnChanged.next(this.userAccountsSchema);
            });
        this._accountService.userAccountsDataDTOOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((userAccountDataDTO) => {
                this.userAccountDataDTO = userAccountDataDTO;
                this.userAccountDataDTOOnChanged.next(this.userAccountDataDTO);
            });
        this._mediaService.photosVideosOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((photosVideos) => {
                this.photosVideos = photosVideos;
                this.photosVideosOnChanged.next(photosVideos);
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    updateSessionProfileAvatar(avatar: string): void {
        this._userProfileSession.setProfileAvatar(avatar);
    }
    doCheckAreFriends(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (this.user.id !== this._authTokenSession.currentAuthUser.id) {
                const httpConfig = this._http.getSrvHttpConfig(
                    SrvApiEnvEnum.areFriends,
                    [this.user.id, this._authTokenSession.currentAuthUser.id]
                );
                this._http
                    .GetObs(httpConfig, true)
                    .subscribe((userFriend: any) => {
                        this._authTokenSession.checkAuthTokenStatus();
                        this.areFriends = userFriend.friends;

                        this.showFullProfile =
                            this.areFriends ||
                            this.ownerOfProfile ||
                            this.user.public;
                        resolve();
                    }, resolve);
            } else {
                this.showFullProfile =
                    this.areFriends || this.ownerOfProfile || this.user.public;
                resolve();
            }
        });
    }

    doLoadUserProfile(): Observable<any> | Promise<any> | any {
        return new Promise<void>((resolve, reject) => {
            Promise.all([
                this.getTimeline(),
                this.getAbout(),
                this.getActivities(),
                this.getFriends(),
                this.getGroups(),
                this.getCountries(),
                this.getTitles(),
                this.getAccounts(),
            ]).then(() => {
                this.getMediaAndPhotos();

                if (this._authTokenSession.devUser) {
                    this.getUserDTO();
                    this.getInsUserDTO();
                    this.getUpdUserDTO();
                    this.getUserSchema();
                    this.getTimelineDTO();
                    this.getPostDTO();
                    this.getUpdPostDTO();
                    this.getPostSchema();
                    this.getPostMediaDTO();
                    this.getPostMediaSchema();
                    this.getUserTimelineCommentDTO();
                    this.getUpdUserTimelineCommentDTO();
                    this.getUserTimelineCommentSchema();
                    this._accountService.getAccountsDTO();
                    this._accountService.getAccountsSchema();
                    this._accountService.getAccountsUpdDTO();
                    this._accountService.getUserAccountsDTO();
                    this._accountService.getUserAccountsSchema();
                    this._accountService.getUserAccountsUpdDTO();
                    this._accountService.getUserAccountsDataDTO();
                } else {
                    this.userDTO = undefined;
                    this.updUserDTO = undefined;
                    this.insUserDTO = undefined;
                    this.usersSchema = undefined;
                    this.userTimelineDTO = undefined;
                    this.postDTO = undefined;
                    this.updPostDTO = undefined;
                    this.postSchema = undefined;
                    this.postMediaDTO = undefined;
                    this.postMediaSchema = undefined;
                    this.accountDTO = undefined;
                    this.updAccountDTO = undefined;
                    this.accountsSchema = undefined;
                    this.userAccountDTO = undefined;
                    this.updUserAccountDTO = undefined;
                    this.userAccountsSchema = undefined;
                    this.userAccountDataDTO = undefined;
                    this.userDTOOnChanged.next(this.userDTO);
                    this.updUserDTOOnChanged.next(this.updUserDTO);
                    this.insUserDTOOnChanged.next(this.insUserDTO);
                    this.usersSchemaOnChanged.next(this.usersSchema);
                    this.userTimelineDTOOnChanged.next(this.userTimelineDTO);
                    this.postDTOOnChanged.next(this.postDTO);
                    this.updPostDTOOnChanged.next(this.updPostDTO);
                    this.postSchemaOnChanged.next(this.postSchema);
                    this.postMediaDTOOnChanged.next(this.postMediaDTO);
                    this.postMediaSchemaOnChanged.next(this.postMediaSchema);
                    this.userTimelineCommentDTOOnChanged.next(
                        this.userTimelineCommentDTO
                    );
                    this.updUserTimelineCommentDTOOnChanged.next(
                        this.updUserTimelineCommentDTO
                    );
                    this.userTimelineCommentSchemaOnChanged.next(
                        this.userTimelineCommentSchema
                    );
                    this.accountDTOOnChanged.next(this.accountDTO);
                    this.updAccountDTOOnChanged.next(this.updAccountDTO);
                    this.accountSchemaOnChanged.next(this.accountsSchema);
                    this.userAccountDTOOnChanged.next(this.userAccountDTO);
                    this.updUserAccountDTOOnChanged.next(
                        this.updUserAccountDTO
                    );
                    this.userAccountSchemaOnChanged.next(
                        this.userAccountsSchema
                    );
                    this.userAccountDataDTOOnChanged.next(
                        this.userAccountDataDTO
                    );
                }
                resolve();
            }, reject);
        });
    }

    getAccounts(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!this.showFullProfile) {
                resolve();
                return;
            }

            this._accountService.doLoadAccounts(this.user.id).finally(() => {
                resolve();
            });
        });
    }

    getMediaAndPhotos(): void {
        if (!this.showFullProfile) {
            return;
        }
        this._mediaService.getPhotosVideos();
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return new Promise((resolve) => {
            this.doCheckAreFriends().finally(() => {
                this.doLoadUserProfile().then(() => {
                    this.userOnChanged.next(this.user);
                    resolve('');
                });
            });
        });
    }




    /**
     * Get userTimeline
     */
    getTimeline(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!this.showFullProfile) {
                this.userTimeline = [];
                resolve(this.userTimeline);
                return;
            }
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userTimeline,
                [this.user.id, '10']
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((userTimeline: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.userTimeline = userTimeline;
                    this.getTimelinePostMedias();
                    this.getTimelineComments();
                    this.getTimelinePostUser();
                    // this.userTimelineOnChanged.next(this.userTimeline);
                    resolve(this.userTimeline);
                }, reject);
        });
    }

    /**
     * populate comment users with user data
     */

    doPopulateCommentUserFromCache(comment: any): void {
        const user = this._userAccountGroupCache.getUserFromCache(comment.user_id);
        if (user) {
            comment.user = user;
        }
    }

    /**
     * This function populates the timeline comments
     * @param timelinePost - timeline post
     */
    doGetPostComments(timelinePost): Promise<void> {
        return new Promise((resolve) => {
            const promiseList: Promise<any>[] = [];
            const userIdList: string[] = [];
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userTimelineCommentsByTimelineId,
                [timelinePost.id]
            );
            this._http.Get(httpConfig, true).then((comments: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                timelinePost.newComment = '';
                timelinePost.comments = comments;

                timelinePost.comments.forEach(async (comment) => {
                    comment.isCommentEmojiPickerVisible = false;
                    comment.time = moment(comment.date_comment).fromNow();
                    const found = userIdList.includes(comment.user_id);
                    if (!found) {
                        userIdList.push(comment.user_id);
                    }
                });
                userIdList.forEach((id) => {
                    promiseList.push(this._userAccountGroupCache.getBasicUserData(id));
                });
                if (promiseList.length > 0) {
                    Promise.all(promiseList).finally(() => {
                        timelinePost.comments.forEach(async (comment) => {
                            this.doPopulateCommentUserFromCache(comment);
                        });
                        this.userTimelineOnChanged.next(this.userTimeline);
                        resolve();
                    });
                } else {
                    timelinePost.comments.forEach(async (comment) => {
                        this.doPopulateCommentUserFromCache(comment);
                    });
                    resolve();
                }
            });
        });
    }

    /**
     * Get timeline comments
     */
    getTimelineComments(): Promise<void> {
        return new Promise((resolve) => {
            const promiseList: Promise<any>[] = [];
            this.userTimeline.forEach((timelinePost) => {
                promiseList.push(this.doGetPostComments(timelinePost));
            });
            if (promiseList.length > 0) {
                Promise.all(promiseList).finally(() => {
                    this.userTimelineOnChanged.next(this.userTimeline);
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    getPostMedia(timelinePost: any): Promise<void> {
        return new Promise((resolve, reject) => {
            let doFindPostMedia = true;
            this.postMedias.some((medias) => {
                if (
                    medias.length > 0 &&
                    medias[0].post_id === timelinePost.id
                ) {
                    timelinePost.medias = medias;
                    doFindPostMedia = false;
                }
            });
            if (doFindPostMedia) {
                const httpConfig = this._http.getSrvHttpConfig(
                    SrvApiEnvEnum.postMediaByPostId,
                    [timelinePost.id]
                );
                this._http
                    .Get(httpConfig, true)
                    .then((medias: any[]) => {
                        this.postMedias.push(medias);
                        timelinePost.medias = medias;
                        resolve();
                    })
                    .catch(() => {
                        reject();
                    });
            } else {
                resolve();
            }
        });
    }

    /**
     * Get timeline comments
     */
    getTimelinePostMedias(): Promise<void> {
        return new Promise((resolve) => {
            const promiseList: Promise<any>[] = [];
            this.userTimeline.forEach((timelinePost) => {
                promiseList.push(this.getPostMedia(timelinePost));
            });
            if (promiseList.length > 0) {
                Promise.all(promiseList).finally(() => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.userTimelineOnChanged.next(this.userTimeline);
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * populate the timeline post user data
     */
    doPopulateTimelineUserFromCache(): void {
        this.userTimeline.forEach((timeline) => {
            const user = this._userAccountGroupCache.getUserFromCache(timeline.post_user_id);
            if (user) {
                timeline.user = user;
            }
        });
    }

    /**
     * populate timeline posts user with user data
     */
    getTimelinePostUser(): void {
        const promiseList: Promise<any>[] = [];
        const userIdList: string[] = [];
        this.userTimeline.forEach((timeline) => {
            timeline.time = timeline.post_date;
            const found = userIdList.includes(timeline.post_user_id);
            if (!found) {
                userIdList.push(timeline.post_user_id);
            }
        });
        userIdList.forEach((id) => {
            promiseList.push(this._userAccountGroupCache.getBasicUserData(id));
        });
        if (promiseList.length > 0) {
            Promise.all(promiseList).finally(() => {
                this.doPopulateTimelineUserFromCache();
                this.userTimelineOnChanged.next(this.userTimeline);
            });
        } else {
            this.doPopulateTimelineUserFromCache();
            this.userTimelineOnChanged.next(this.userTimeline);
        }
    }

    /**
     * Get about
     */
    getAbout(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.about,
                [this.user.id]
            );
            this._http.GetObs(httpConfig, true).subscribe((about: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.about = about;
                this.aboutOnChanged.next(this.about);
                resolve(this.about);
            }, reject);
        });
    }

    /**
     * populate activity users with user data
     */
    doPopulateActivityUserFromCache(): void {
        this.activities.forEach(async (activity) => {
            if (!this._fn.isZeroUuid(activity.user_id)) {
                const user = await this._userAccountGroupCache.getBasicUserData(activity.user_id);
                if (user) {
                    activity.user = user;
                }
            }
            if (!this._fn.isZeroUuid(activity.account_id)) {
                const user = await this._userAccountGroupCache.getBasicAccountData(activity.account_id);
                if (user) {
                    activity.user = user;
                }
            }
            if (!this._fn.isZeroUuid(activity.group_id)) {
                const user = await this._userAccountGroupCache.getBasicGroupData(activity.group_id);
                if (user) {
                    activity.user = user;
                }
            }
        });
    }
    /**
     * populate activities user with user data
     */
    getActivitiesUser(): void {
        const promiseList: Promise<any>[] = [];
        const userIdList: string[] = [];
        const accountIdList: string[] = [];
        const groupIdList: string[] = [];
        this.activities.forEach((activity) => {
            if (!this._fn.isZeroUuid(activity.user_id)) {
                const found = userIdList.includes(activity.user_id);
                if (!found) {
                    userIdList.push(activity.user_id);
                }
            }
            if (!this._fn.isZeroUuid(activity.account_id)) {
                const found = accountIdList.includes(activity.account_id);
                if (!found) {
                    accountIdList.push(activity.account_id);
                }
            }
            if (!this._fn.isZeroUuid(activity.group_id)) {
                const found = groupIdList.includes(activity.group_id);
                if (!found) {
                    groupIdList.push(activity.group_id);
                }
            }
        });

        const getUserBasicData = (idx: number): void => {
            if (userIdList.length === 0) {
                return;
            }
            this._userAccountGroupCache.getBasicUserData(userIdList[idx]).finally(() => {
                if (idx + 1 >= userIdList.length) {
                    this.doPopulateActivityUserFromCache();
                    this.activitiesOnChanged.next(this.activities);
                } else {
                    getUserBasicData(idx + 1);
                }
            });
        };

        const getAccountBasicData = (idx: number): void => {
            if (accountIdList.length === 0) {
                return;
            }
            this._userAccountGroupCache.getBasicAccountData(accountIdList[idx]).finally(() => {
                if (idx + 1 >= accountIdList.length) {
                    this.doPopulateActivityUserFromCache();
                    this.activitiesOnChanged.next(this.activities);
                } else {
                    getAccountBasicData(idx + 1);
                }
            });
        };

        const getGroupBasicData = (idx: number): void => {
            if (groupIdList.length === 0) {
                return;
            }
            this._userAccountGroupCache.getBasicGroupData(groupIdList[idx]).finally(() => {
                if (idx + 1 >= groupIdList.length) {
                    this.doPopulateActivityUserFromCache();
                    this.activitiesOnChanged.next(this.activities);
                } else {
                    getGroupBasicData(idx + 1);
                }
            });
        };

        getUserBasicData(0);
        getAccountBasicData(0);
        getGroupBasicData(0);

    }

    /**
     * Get activities
     */
    getActivities(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!this.showFullProfile) {
                this.activities = [];
                resolve(this.activities);
                return;
            }
            this._activities.getActivities(this.user.id).then((activities) => {
                this.activities = activities;
                this.getActivitiesUser();
                this.activitiesOnChanged.next(this.activities);
                resolve(this.activities);
            });
        });
    }

    /**
     * Get friends
     */
    getFriends(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!this.showFullProfile) {
                this.friends = [];
                resolve(this.friends);
                return;
            }
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.friends,
                [this.user.id]
            );
            this._http.GetObs(httpConfig, true).subscribe((friends: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.friends = friends;
                this.friendsOnChanged.next(this.friends);
                resolve(this.friends);
            }, reject);
        });
    }

    /**
     * Get groups
     */
    getGroups(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!this.showFullProfile) {
                this.groups = [];
                resolve(this.groups);
                return;
            }
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userGroups,
                [this.user.id]
            );
            this._http.GetObs(httpConfig, true).subscribe((groups: any) => {
                this._authTokenSession.checkAuthTokenStatus();

                this.groups = groups;
                this.groupsOnChanged.next(this.groups);
                resolve(this.groups);
            }, reject);
        });
    }

    /**
     * Get user DTO
     */
    getUserDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userDTO
            );
            this._http.GetObs(httpConfig, true).subscribe((userDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.userDTO = userDTO;
                this.userDTOOnChanged.next(this.userDTO);
                resolve(this.userDTO);
            }, reject);
        });
    }
    /**
     * Get user schema
     */
    getUserSchema(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.usersSchema
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((usersSchema: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.usersSchema = usersSchema;
                    this.usersSchemaOnChanged.next(this.usersSchema);
                    resolve(this.usersSchema);
                }, reject);
        });
    }

    /**
     * Get Insert user DTO
     */
    getInsUserDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.insUserDTO
            );
            this._http.GetObs(httpConfig, true).subscribe((insUserDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.insUserDTO = insUserDTO;
                this.insUserDTOOnChanged.next(this.insUserDTO);
                resolve(this.insUserDTO);
            }, reject);
        });
    }

    /**
     * Get user DTO
     */
    getUpdUserDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.updUserDTO
            );
            this._http.GetObs(httpConfig, true).subscribe((updUserDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.updUserDTO = updUserDTO;
                this.updUserDTOOnChanged.next(this.updUserDTO);
                resolve(this.updUserDTO);
            }, reject);
        });
    }

    /**
     * Get Country listing from json file
     */
    getCountries(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getHttpConfig(
                SrvApiEnvEnum.COUNTRIES_JSON,
                [],
                undefined
            );
            this._http.GetObs(httpConfig, true).subscribe((countries: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.countries = countries;
                this.countriesOnChanged.next(countries);
                resolve(this.countries);
            }, reject);
        });
    }

    /**
     * Get Country listing from json file
     */
    getTitles(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getHttpConfig(
                SrvApiEnvEnum.TITLES_JSON,
                undefined,
                undefined
            );
            this._http.GetObs(httpConfig, true).subscribe((titles: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.titles = titles;
                this.titlesOnChanged.next(titles);
                resolve(this.titles);
            }, reject);
        });
    }
    /**
     * Get user data
     */
    getFullUserData(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userByUserId,
                [this.user.id]
            );

            this._http
                .GetObs(httpConfig, true)
                .subscribe((userFullData: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.userFullData = userFullData;
                    this.userFullDataOnChanged.next(this.userFullData);
                    resolve(this.userFullData);
                }, reject);
        });
    }
    /**
     * Update the user profile data
     */
    updateUserData(userId: string, updateDTO: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userByUserId,
                [userId],
                updateDTO
            );

            this._http.PatchObs(httpConfig, true).subscribe((resp: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.getFullUserData();
                this.doLoadUserProfile();
                resolve(resp);
            }, reject);
        });
    }

    /**
     * Get userTimeline DTO
     */
    getTimelineDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userTimelineDTO
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((userTimelineDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.userTimelineDTO = userTimelineDTO;
                    this.userTimelineDTOOnChanged.next(this.userTimelineDTO);
                    resolve(this.userTimelineDTO);
                }, reject);
        });
    }
    /**
     * Get post DTO
     */
    getPostDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.postDTO
            );
            this._http.GetObs(httpConfig, true).subscribe((postDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.postDTO = postDTO;
                this.postDTOOnChanged.next(this.postDTO);
                resolve(this.postDTO);
            }, reject);
        });
    }
    /**
     * Get update post DTO
     */
    getUpdPostDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.updPostDTO
            );
            this._http.GetObs(httpConfig, true).subscribe((updPostDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.updPostDTO = updPostDTO;
                this.updPostDTOOnChanged.next(this.updPostDTO);
                resolve(this.updPostDTO);
            }, reject);
        });
    }
    /**
     * Get post schema
     */
    getPostSchema(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.postSchema
            );
            this._http.GetObs(httpConfig, true).subscribe((postSchema: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.postSchema = postSchema;
                this.postSchemaOnChanged.next(this.postSchema);
                resolve(this.postSchema);
            }, reject);
        });
    }
    /**
     * Get post media DTO
     */
    getPostMediaDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.postMediaDTO
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((postMediaDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.postMediaDTO = postMediaDTO;
                    this.postMediaDTOOnChanged.next(this.postMediaDTO);
                    resolve(this.postMediaDTO);
                }, reject);
        });
    }

    /**
     * Get post media schema
     */
    getPostMediaSchema(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.postMediaSchema
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((postMediaSchema: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.postMediaSchema = postMediaSchema;
                    this.postMediaSchemaOnChanged.next(this.postMediaSchema);
                    resolve(this.postMediaSchema);
                }, reject);
        });
    }


    /**
     * Get basic account data
     */
    getBasicAccountDataFromServer(accountId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.basicAccountByAccountId,
                [accountId]
            );

            this._http
                .GetObs(httpConfig, true)
                .subscribe((accountBasicData: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    resolve(accountBasicData);
                }, reject);
        });
    }

    /**
     * Get user data
     */
    getUserData(userId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userByUserId,
                [userId]
            );

            this._http
                .GetObs(httpConfig, true)
                .subscribe((userBasicData: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    resolve(userBasicData);
                }, reject);
        });
    }

    /**
     * Get userTimelineComment DTO
     */
    getUserTimelineCommentDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userTimelineCommentDTO
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((userTimelineCommentDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.userTimelineCommentDTO = userTimelineCommentDTO;
                    this.userTimelineCommentDTOOnChanged.next(
                        this.userTimelineCommentDTO
                    );
                    resolve(this.userTimelineCommentDTO);
                }, reject);
        });
    }
    /**
     * Get update UserTimelineComment DTO
     */
    getUpdUserTimelineCommentDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.updUserTimelineCommentDTO
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((updUserTimelineCommentDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.updUserTimelineCommentDTO = updUserTimelineCommentDTO;
                    this.updUserTimelineCommentDTOOnChanged.next(
                        this.updUserTimelineCommentDTO
                    );
                    resolve(this.updUserTimelineCommentDTO);
                }, reject);
        });
    }
    /**
     * Get UserTimelineComment schema
     */
    getUserTimelineCommentSchema(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userTimelineCommentSchema
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((userTimelineCommentSchema: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.userTimelineCommentSchema = userTimelineCommentSchema;
                    this.userTimelineCommentSchemaOnChanged.next(
                        this.userTimelineCommentSchema
                    );
                    resolve(this.userTimelineCommentSchema);
                }, reject);
        });
    }

    /**
     * Update User Profile Avatar
     */
    updateUserAvatar(userId: string, avatar: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.updateUserAvatar,
                [userId],
                {
                    avatar: avatar,
                }
            );
            this._http
                .Put(httpConfig, true)
                .then(() => {
                    this.updateSessionProfileAvatar(avatar);
                    this.friends.some((fr) => {
                        if (fr.id === userId) {
                            fr.avatar = avatar;
                            return true;
                        }
                    });
                    this.strangers.some((fr) => {
                        if (fr.id === userId) {
                            fr.avatar = avatar;
                            return true;
                        }
                    });
                    this._authTokenSession.checkAuthTokenStatus();

                    this.getActivitiesUser();
                    this.getTimelinePostUser();
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    }
}
