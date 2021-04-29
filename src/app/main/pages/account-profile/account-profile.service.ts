import { AccountProfileSessionService } from './../../../services/session/account-profile-session.service';
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
import * as moment from 'moment';
import { MediaService, UploadMode } from 'app/services/media/media.service';
import { CommonFn } from 'app/shared/common-fn';
import { ActivityService } from 'app/services/activity/activity.service';
import { AuthTokenSessionService } from '../../../services/auth-token-session/auth-token-session.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { AccountsService } from 'app/services/account/account.service';
import { UserAccountGroupCacheService } from 'app/services/user-account-group-cache/user-account-group-cache.service';

@Injectable()
export class AccountProfileService implements Resolve<any>, OnDestroy {
    profileType = 'ACCOUNT';

    accountTimelineDTO: any;
    postDTO: any;
    updPostDTO: any;
    postSchema: any;
    postMediaDTO: any;
    postMediaSchema: any;

    accountTimelineCommentDTO: any;
    updAccountTimelineCommentDTO: any;
    accountTimelineCommentSchema: any;

    accountFullData: any;
    userBasicData: any;
    areAccountGroupMembers = false;
    ownerOfProfile = false;
    showFullProfile = false;
    accountTimeline: any[];
    about: any;
    photosVideos: any[];

    account: any;

    accountDTO: any;
    updAccountDTO: any;
    accountsSchema: any;

    activities: any[];
    members: any[];
    groups: any[];
    countries: any[];
    titles: any[];
    postMedias: any[];

    accountOnChanged: BehaviorSubject<any>;
    ownerOfProfileOnChanged: BehaviorSubject<any>;

    accountDTOOnChanged: BehaviorSubject<any>;
    updAccountDTOOnChanged: BehaviorSubject<any>;
    accountSchemaOnChanged: BehaviorSubject<any>;

    accountTimelineOnChanged: BehaviorSubject<any>;
    aboutOnChanged: BehaviorSubject<any>;
    photosVideosOnChanged: BehaviorSubject<any>;
    activitiesOnChanged: BehaviorSubject<any>;
    membersOnChanged: BehaviorSubject<any>;
    groupsOnChanged: BehaviorSubject<any>;
    countriesOnChanged: BehaviorSubject<any>;
    userBasicDataOnChanged: BehaviorSubject<any>;
    accountFullDataOnChanged: BehaviorSubject<any>;
    titlesOnChanged: BehaviorSubject<any>;
    accountTimelineDTOOnChanged: BehaviorSubject<any>;

    postDTOOnChanged: BehaviorSubject<any>;
    updPostDTOOnChanged: BehaviorSubject<any>;
    postSchemaOnChanged: BehaviorSubject<any>;
    postMediaDTOOnChanged: BehaviorSubject<any>;
    postMediaSchemaOnChanged: BehaviorSubject<any>;

    accountTimelineCommentDTOOnChanged: BehaviorSubject<any>;
    updAccountTimelineCommentDTOOnChanged: BehaviorSubject<any>;
    accountTimelineCommentSchemaOnChanged: BehaviorSubject<any>;
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
        private _accountProfileSession: AccountProfileSessionService,
        private _authTokenSession: AuthTokenSessionService,
        public _accountService: AccountsService,
        private _logger: LoggerService,
        private _activities: ActivityService,
        public _userAccountGroupCache: UserAccountGroupCacheService,
        private _fn: CommonFn
    ) {
        this._mediaService = new MediaService(
            this._logger,
            this._http,
            this._authTokenSession,
            this._fn,
            UploadMode.AccountMedia
        );
        this.account = this._accountProfileSession.accountProfileValue;

        this.userBasicData = undefined;
        this.accountFullData = undefined;
        this.accountTimeline = [];
        this.about = {};
        this.photosVideos = [];
        this.activities = [];
        this.members = [];
        this.groups = [];
        this.countries = [];
        this.titles = [];
        this.postMedias = [];

        this._mediaService.initMediaService(
            UploadMode.AccountMedia,
            undefined,
            this._accountService.account,
            undefined
        );
        // Set the defaults
        this.ownerOfProfileOnChanged = new BehaviorSubject(this.ownerOfProfile);

        this.accountOnChanged = new BehaviorSubject(this.account);
        this.accountDTOOnChanged = new BehaviorSubject(
            this._accountService.accountsDTO
        );
        this.updAccountDTOOnChanged = new BehaviorSubject(
            this._accountService.accountsUpdDTO
        );
        this.accountSchemaOnChanged = new BehaviorSubject(
            this._accountService.accountsSchema
        );

        this.accountTimelineOnChanged = new BehaviorSubject(
            this.accountTimeline
        );
        this.aboutOnChanged = new BehaviorSubject(this.about);
        this.photosVideosOnChanged = new BehaviorSubject(this.photosVideos);
        this.activitiesOnChanged = new BehaviorSubject(this.activities);
        this.membersOnChanged = new BehaviorSubject(this.members);
        this.groupsOnChanged = new BehaviorSubject(this.groups);
        this.countriesOnChanged = new BehaviorSubject(this.countries);
        this.titlesOnChanged = new BehaviorSubject(this.titles);
        this.userBasicDataOnChanged = new BehaviorSubject(this.userBasicData);
        this.accountFullDataOnChanged = new BehaviorSubject(
            this.accountFullData
        );

        this.accountTimelineDTOOnChanged = new BehaviorSubject(
            this.accountTimelineDTO
        );
        this.postDTOOnChanged = new BehaviorSubject(this.postDTO);
        this.updPostDTOOnChanged = new BehaviorSubject(this.updPostDTO);
        this.postSchemaOnChanged = new BehaviorSubject(this.postSchema);
        this.postMediaDTOOnChanged = new BehaviorSubject(this.postMediaDTO);
        this.postMediaSchemaOnChanged = new BehaviorSubject(
            this.postMediaSchema
        );
        this.accountTimelineCommentDTOOnChanged = new BehaviorSubject(
            this.accountTimelineCommentDTO
        );
        this.updAccountTimelineCommentDTOOnChanged = new BehaviorSubject(
            this.updAccountTimelineCommentDTO
        );
        this.accountTimelineCommentSchemaOnChanged = new BehaviorSubject(
            this.accountTimelineCommentSchema
        );
        this.updateOwnerOfProfile();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this._accountProfileSession.accountProfileOnChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((account) => {
                this.account = account;
                this._mediaService.initMediaService(
                    UploadMode.AccountMedia,
                    undefined,
                    this.account,
                    undefined
                );
                this.updateOwnerOfProfile().finally(() => {
                    this.doCheckAreAccountGroupMembers().finally(() => {
                        this.doLoadAccountProfile().then(() => {
                            this.accountOnChanged.next(this.account);
                        });
                    });
                });
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

    checkShowFullProfile(): void {
        this.showFullProfile =
            this.areAccountGroupMembers ||
            this.ownerOfProfile ||
            this.account.public;
    }

    updateOwnerOfProfile(): Promise<void> {
        return new Promise((resolve) => {
            this.ownerOfProfile = false;
            this.ownerOfProfileOnChanged.next(this.ownerOfProfile);
            if (this._authTokenSession.isLoggedIn()) {
                if (this.account) {
                    this._accountProfileSession
                    .getBasicAccount(this.account.id)
                    .finally(() => {
                        this.ownerOfProfile = this._accountProfileSession.accountHolder(
                            this._authTokenSession.currentAuthUser.id
                        );
                        this.checkShowFullProfile();
                        this.ownerOfProfileOnChanged.next(this.ownerOfProfile);
                        resolve();
                    });
                } else {
                    resolve();
                }
            } else {
                resolve();
            }
        });
    }

    doCheckAreAccountGroupMembers(): Promise<void> {
        return new Promise<void>((resolve) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.areAccountMembers,
                [this.account.id, this._authTokenSession.currentAuthUser.id]
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((accountGroupMember: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.areAccountGroupMembers =
                        accountGroupMember.accountGroupMembers;

                    this.checkShowFullProfile();
                    resolve();
                }, resolve);
        });
    }

    doLoadAccountProfile(): Observable<any> | Promise<any> | any {
        return new Promise<void>((resolve, reject) => {
            if (!this._authTokenSession.isLoggedIn()) {
                resolve(undefined);
                return;
            }
            if (this.account) {
                Promise.all([
                    this.getTimeline(),
                    this.getAbout(),
                    this.getActivities(),
                    this.getAccountMembers(),
                    this.getGroups(),
                    this.getCountries(),
                ]).then(() => {
                    this.getMediaAndPhotos();
    
                    if (this._authTokenSession.devUser) {
                        this.getTimelineDTO();
                        this.getPostDTO();
                        this.getUpdPostDTO();
                        this.getPostSchema();
                        this.getPostMediaDTO();
                        this.getPostMediaSchema();
                        this.getAccountTimelineCommentDTO();
                        this.getUpdAccountTimelineCommentDTO();
                        this.getAccountTimelineCommentSchema();
                        this._accountService.getAccountsDTO();
                        this._accountService.getAccountsSchema();
                        this._accountService.getAccountsUpdDTO();
                        this._accountService.getUserAccountsDTO();
                        this._accountService.getUserAccountsSchema();
                        this._accountService.getUserAccountsUpdDTO();
                        this._accountService.getUserAccountsDataDTO();
                    } else {
                        this.accountTimelineDTO = undefined;
                        this.postDTO = undefined;
                        this.updPostDTO = undefined;
                        this.postSchema = undefined;
                        this.postMediaDTO = undefined;
                        this.postMediaSchema = undefined;
                        this.accountDTO = undefined;
                        this.updAccountDTO = undefined;
                        this.accountsSchema = undefined;
                        this.accountTimelineDTOOnChanged.next(
                            this.accountTimelineDTO
                        );
                        this.postDTOOnChanged.next(this.postDTO);
                        this.updPostDTOOnChanged.next(this.updPostDTO);
                        this.postSchemaOnChanged.next(this.postSchema);
                        this.postMediaDTOOnChanged.next(this.postMediaDTO);
                        this.postMediaSchemaOnChanged.next(this.postMediaSchema);
                        this.accountTimelineCommentDTOOnChanged.next(
                            this.accountTimelineCommentDTO
                        );
                        this.updAccountTimelineCommentDTOOnChanged.next(
                            this.updAccountTimelineCommentDTO
                        );
                        this.accountTimelineCommentSchemaOnChanged.next(
                            this.accountTimelineCommentSchema
                        );
                        this.accountDTOOnChanged.next(this.accountDTO);
                        this.updAccountDTOOnChanged.next(this.updAccountDTO);
                        this.accountSchemaOnChanged.next(this.accountsSchema);
                    }
                    resolve();
                }, reject);
            } else {
                resolve();
            }
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
            if (this.account) {
                this.updateOwnerOfProfile().finally(() => {
                    this.doCheckAreAccountGroupMembers().finally(() => {
                        this.doLoadAccountProfile().then(() => {
                            this.accountOnChanged.next(this.account);
                            resolve('');
                        });
                    });
                });
            } else {
                resolve('');
            }
        });
    }



    /**
     * Get accountTimeline
     */
    getTimeline(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!this.showFullProfile) {
                this.accountTimeline = [];
                resolve(this.accountTimeline);
                return;
            }
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountTimeline,
                [this.account.id, '10']
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((accountTimeline: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.accountTimeline = accountTimeline;
                    this.getTimelinePostMedias();
                    this.getTimelineComments();
                    this.getTimelinePostUser();
                    // this.accountTimelineOnChanged.next(this.accountTimeline);
                    resolve(this.accountTimeline);
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
                SrvApiEnvEnum.accountGroupTimelineCommentsByTimelineId,
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
                        this.accountTimelineOnChanged.next(
                            this.accountTimeline
                        );
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
            this.accountTimeline.forEach((timelinePost) => {
                promiseList.push(this.doGetPostComments(timelinePost));
            });
            if (promiseList.length > 0) {
                Promise.all(promiseList).finally(() => {
                    this.accountTimelineOnChanged.next(this.accountTimeline);
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
            this.accountTimeline.forEach((timelinePost) => {
                promiseList.push(this.getPostMedia(timelinePost));
            });
            if (promiseList.length > 0) {
                Promise.all(promiseList).finally(() => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.accountTimelineOnChanged.next(this.accountTimeline);
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
        this.accountTimeline.forEach((timeline) => {
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
        this.accountTimeline.forEach((timeline) => {
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
                this.accountTimelineOnChanged.next(this.accountTimeline);
            });
        } else {
            this.doPopulateTimelineUserFromCache();
            this.accountTimelineOnChanged.next(this.accountTimeline);
        }
    }

    /**
     * Get about
     */
    getAbout(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.aboutAccount,
                [this.account.id]
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
        userIdList.forEach((id) => {
            promiseList.push(this._userAccountGroupCache.getBasicUserData(id));
        });
        accountIdList.forEach((id) => {
            promiseList.push(this._userAccountGroupCache.getBasicAccountData(id));
        });        
        groupIdList.forEach((id) => {
            promiseList.push(this._userAccountGroupCache.getBasicGroupData(id));
        });
        if (promiseList.length > 0) {
            Promise.all(promiseList).finally(() => {
                this.doPopulateActivityUserFromCache();
                this.activitiesOnChanged.next(this.activities);
            });
        } else {
            this.doPopulateActivityUserFromCache();
            this.activitiesOnChanged.next(this.activities);
        }
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
            this._activities
                .getAccountActivities(this.account.id)
                .then((activities) => {
                    this.activities = activities;
                    this.getActivitiesUser();
                    this.activitiesOnChanged.next(this.activities);
                    resolve(this.activities);
                });
        });
    }

    /**
     * Get members
     */
    getAccountMembers(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!this.showFullProfile) {
                this.members = [];
                resolve(this.members);
                return;
            }
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountMembers,
                [this.account.id]
            );
            this._http.GetObs(httpConfig, true).subscribe((members: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.members = members;
                this.membersOnChanged.next(this.members);
                resolve(this.members);
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
                SrvApiEnvEnum.accountGroups,
                [this.account.id]
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
     * Get account data
     */
    getFullAccountData(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountById,
                [this.account.id]
            );

            this._http
                .GetObs(httpConfig, true)
                .subscribe((accountFullData: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.accountFullData = accountFullData;
                    this.accountFullDataOnChanged.next(this.accountFullData);
                    resolve(this.accountFullData);
                }, reject);
        });
    }
    /**
     * Update the account profile data
     */
    updateAccountData(accountId: string, updateDTO: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountById,
                [accountId],
                updateDTO
            );

            this._http.PatchObs(httpConfig, true).subscribe((resp: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.getFullAccountData();
                this.doLoadAccountProfile();
                resolve(resp);
            }, reject);
        });
    }

    /**
     * Get accountTimeline DTO
     */
    getTimelineDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountGroupTimelineDTO
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((accoutnGroupTimelineDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.accountTimelineDTO = accoutnGroupTimelineDTO;
                    this.accountTimelineDTOOnChanged.next(
                        this.accountTimelineDTO
                    );
                    resolve(this.accountTimelineDTO);
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
     * Get accountTimelineComment DTO
     */
    getAccountTimelineCommentDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountGroupTimelineCommentDTO
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((accountTimelineCommentDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.accountTimelineCommentDTO = accountTimelineCommentDTO;
                    this.accountTimelineCommentDTOOnChanged.next(
                        this.accountTimelineCommentDTO
                    );
                    resolve(this.accountTimelineCommentDTO);
                }, reject);
        });
    }
    /**
     * Get update AccountTimelineComment DTO
     */
    getUpdAccountTimelineCommentDTO(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.updAccountGroupTimelineCommentDTO
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((updAccountTimelineCommentDTO: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.updAccountTimelineCommentDTO = updAccountTimelineCommentDTO;
                    this.updAccountTimelineCommentDTOOnChanged.next(
                        this.updAccountTimelineCommentDTO
                    );
                    resolve(this.updAccountTimelineCommentDTO);
                }, reject);
        });
    }
    /**
     * Get AccountTimelineComment schema
     */
    getAccountTimelineCommentSchema(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountGroupTimelineCommentSchema
            );
            this._http
                .GetObs(httpConfig, true)
                .subscribe((accountTimelineCommentSchema: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.accountTimelineCommentSchema = accountTimelineCommentSchema;
                    this.accountTimelineCommentSchemaOnChanged.next(
                        this.accountTimelineCommentSchema
                    );
                    resolve(this.accountTimelineCommentSchema);
                }, reject);
        });
    }

    /**
     * Update User Profile Avatar
     */
    updateAccountAvatar(accountId: string, avatar: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.updateAccountAvatar,
                [accountId],
                {
                    avatar: avatar,
                }
            );
            this._http
                .Put(httpConfig, true)
                .then(() => {
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
