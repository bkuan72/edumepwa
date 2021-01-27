import { takeUntil } from 'rxjs/operators';
import { SessionService } from './../../../services/session/session.service';
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
import { Moment } from 'moment';
import * as moment from 'moment';


@Injectable()
export class ProfileService implements Resolve<any>, OnDestroy {
    profileType = 'USER';
    userDTO: any;
    updUserDTO: any;
    insUserDTO: any;
    userSchema: any;
    userTimelineDTO: any;
    postDTO: any;
    updPostDTO: any;
    postSchema: any;

    userTimelineCommentDTO: any;
    updUserTimelineCommentDTO: any;
    userTimelineCommentSchema: any;

    user: any;
    userData: any;
    userTimeline: any[];
    about: any;
    photosVideos: any[];

    activities: any[];
    friends: any[];
    strangers: any[];
    groups: any[];
    countries: any[];
    titles: any[];

    userTimelineOnChanged: BehaviorSubject<any>;
    aboutOnChanged: BehaviorSubject<any>;
    photosVideosOnChanged: BehaviorSubject<any>;
    activitiesOnChanged: BehaviorSubject<any>;
    friendsOnChanged: BehaviorSubject<any>;
    groupsOnChanged: BehaviorSubject<any>;
    userDTOOnChanged: BehaviorSubject<any>;
    updUserDTOOnChanged: BehaviorSubject<any>;
    insUserDTOOnChanged: BehaviorSubject<any>;
    userSchemaOnChanged: BehaviorSubject<any>;
    countriesOnChanged: BehaviorSubject<any>;
    userDataOnChanged: BehaviorSubject<any>;
    titlesOnChanged: BehaviorSubject<any>;
    userTimelineDTOOnChanged: BehaviorSubject<any>;

    postDTOOnChanged: BehaviorSubject<any>;
    updPostDTOOnChanged: BehaviorSubject<any>;
    postSchemaOnChanged: BehaviorSubject<any>;

    userTimelineCommentDTOOnChanged: BehaviorSubject<any>;
    updUserTimelineCommentDTOOnChanged: BehaviorSubject<any>;
    userTimelineCommentSchemaOnChanged: BehaviorSubject<any>;


    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _http
     */
    constructor(
        private _http: SrvHttpService,
        private _session: SessionService,
        private _authTokenSession: AuthTokenSessionService
    ) {
        this.user = this._session.userProfileValue;
        this.userData = undefined;
        this.userTimeline = [];
        this.about = {};
        this.photosVideos = [];
        this.activities = [];
        this.friends = [];
        this.strangers = [];
        this.groups = [];
        this.countries = [];
        this.titles = [];

        // Set the defaults
        this.userTimelineOnChanged = new BehaviorSubject(this.userTimeline);
        this.aboutOnChanged = new BehaviorSubject(this.about);
        this.photosVideosOnChanged = new BehaviorSubject(this.photosVideos);
        this.activitiesOnChanged = new BehaviorSubject(this.activities);
        this.friendsOnChanged = new BehaviorSubject(this.friends);
        this.groupsOnChanged = new BehaviorSubject(this.groups);
        this.userDTOOnChanged = new BehaviorSubject(this.userDTO);
        this.updUserDTOOnChanged = new BehaviorSubject(this.updUserDTO);
        this.insUserDTOOnChanged = new BehaviorSubject(this.insUserDTO);
        this.userSchemaOnChanged = new BehaviorSubject(this.userSchema);
        this.countriesOnChanged = new BehaviorSubject(this.countries);
        this.titlesOnChanged = new BehaviorSubject(this.titles);
        this.userDataOnChanged = new BehaviorSubject(this.userData);

        this.userTimelineDTOOnChanged = new BehaviorSubject(this.userTimelineDTO);
        this.postDTOOnChanged = new BehaviorSubject(this.postDTO);
        this.updPostDTOOnChanged = new BehaviorSubject(this.updPostDTO);
        this.postSchemaOnChanged = new BehaviorSubject(this.postSchema);
        this.userTimelineCommentDTOOnChanged = new BehaviorSubject(this.userTimelineCommentDTO);
        this.updUserTimelineCommentDTOOnChanged = new BehaviorSubject(this.updUserTimelineCommentDTO);
        this.userTimelineCommentSchemaOnChanged = new BehaviorSubject(this.userTimelineCommentSchema);

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this._session.userProfileSubject
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(user => {
            this.user = user;
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    doLoadUserProfile(): Observable<any> | Promise<any> | any {
        return new Promise<void>((resolve, reject) => {

            Promise.all([
                this.getTimeline(),
                this.getAbout(),
                this.getPhotosVideos(),
                this.getActivities(),
                this.getFriends(),
                this.getGroups(),
                this.getCountries(),
                this.getTitles()
            ]).then(() => {
                if (this._authTokenSession.devUser) {
                    this.getUserDTO();
                    this.getInsUserDTO();
                    this.getUpdUserDTO();
                    this.getUserSchema();
                    this.getTimelineDTO();
                    this.getPostDTO();
                    this.getUpdPostDTO();
                    this.getPostSchema();
                    this.getUserTimelineCommentDTO();
                    this.getUpdUserTimelineCommentDTO();
                    this.getUserTimelineCommentSchema();
                } else {
                    this.userDTO = undefined;
                    this.updUserDTO = undefined;
                    this.insUserDTO = undefined;
                    this.userSchema = undefined;
                    this.userTimelineDTO = undefined;
                    this.postDTO = undefined;
                    this.updPostDTO = undefined;
                    this.postSchema = undefined;
                    this.userDTOOnChanged.next(this.userDTO);
                    this.updUserDTOOnChanged.next(this.updUserDTO);
                    this.insUserDTOOnChanged.next(this.insUserDTO);
                    this.userSchemaOnChanged.next(this.userSchema);
                    this.userTimelineDTOOnChanged.next(this.userTimelineDTO);
                    this.postDTOOnChanged.next(this.postDTO);
                    this.updPostDTOOnChanged.next(this.updPostDTO);
                    this.postSchemaOnChanged.next(this.postSchema);
                    this.userTimelineCommentDTOOnChanged.next(this.userTimelineCommentDTO);
                    this.updUserTimelineCommentDTOOnChanged.next(this.updUserTimelineCommentDTO);
                    this.userTimelineCommentSchemaOnChanged.next(this.userTimelineCommentSchema);
                }
                resolve();
            }, reject);
        });
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
        return this.doLoadUserProfile();
    }

    /**
     * Get basic information for userId
     * @param userId - uuid of user
     */
    getUser(userId: string): Promise<any> {
        return new Promise ((resolve) => {
            let fr: any;
            this.friends.some((friend) => {
                if (friend.id === userId) {
                    fr = friend;
                    resolve(fr);
                    return true;
                }
            });
            if (fr === undefined) {
                this.strangers.some((stranger) => {
                    if (stranger.id === userId) {
                        fr = stranger;
                        resolve(fr);
                        return true;
                    }
                });
            }
            if (fr === undefined) {

                this.getBasicUserData(userId).then((userData) => {
                    this.strangers.push(userData);
                    resolve(userData);
                })
                .catch(() => {
                    resolve({ id: '', name: '', avatar: ''});
                });
            }
        });
    }

    /**
     * Get userTimeline
     */
    getTimeline(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userTimeline,
                [this.user.id, '10']
            );
            this._http.GetObs(httpConfig, true).subscribe((userTimeline: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.userTimeline = userTimeline;
                this.getTimelineComments ();
                this.getTimelinePostUser ();
                this.userTimelineOnChanged.next(this.userTimeline);
                resolve(this.userTimeline);
            }, reject);
        });
    }

    /**
     * populate comment users with user data
     */
    doPopulateCommentUser(comment: any): Promise<void>{
        return new Promise((resolve) => {
            this.getUser(comment.user_id).then((user) => {
                comment.user = user;
                resolve();
            })
            .catch(() => {
                resolve();
            });
        });
    }

    /**
     * Get timeline comments
     */
    getTimelineComments(): Promise<void> {
        return new Promise((resolve) => {

            this.userTimeline.forEach((timelinePost) => {
                const httpConfig = this._http.getSrvHttpConfig(
                    SrvApiEnvEnum.userTimelineCommentsByTimelineId,
                    [timelinePost.id]
                );
                this._http.Get(httpConfig, true).then((comments: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    const promiseList: Promise<any>[] = [];
                    timelinePost.newComment = '';
                    timelinePost.comments = comments;
                    timelinePost.comments.forEach(async (comment) => {
                        comment.isCommentEmojiPickerVisible = false;
                        comment.time = moment(comment.date_comment).fromNow();
                        promiseList.push(this.doPopulateCommentUser(comment));
                    });
                    if (promiseList.length > 0) {
                        Promise.all(promiseList).finally(() => {
                            this.userTimelineOnChanged.next(this.userTimeline);
                        });
                    }
                });
            });
            resolve();

        });
    }

    /**
     * populate timeline post user with user data
     */
    doPopulatePostUser(timeline: any): Promise<void>{
        return new Promise((resolve) => {
            this.getUser(timeline.post_user_id).then((user) => {
                timeline.user = user;
                resolve();
            })
            .catch(() => {
                resolve();
            });
        });
    }

    /**
     * populate timeline posts user with user data
     */
    getTimelinePostUser(): void {
        const promiseList: Promise<any>[] = [];
        this.userTimeline.forEach((timeline) => {
            timeline.time = timeline.post_date;
            promiseList.push(this.doPopulatePostUser(timeline));
        });
        if (promiseList.length > 0) {
            Promise.all(promiseList).finally(() => {
                this.userTimelineOnChanged.next(this.userTimeline);
            });
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
     * Get photos & videos
     */
    getPhotosVideos(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.media,
                [this.user.id]
            );

            this._http
                .GetObs(httpConfig, true)
                .subscribe((photosVideos: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.photosVideos = photosVideos;
                    this.photosVideosOnChanged.next(this.photosVideos);
                    resolve(this.photosVideos);
                }, reject);
        });
    }

    /**
     * populate comment users with user data
     */
    doPopulateActivityUser(activity: any): Promise<void>{
        return new Promise((resolve) => {
            this.getUser(activity.user_id).then((user) => {
                activity.user = user;
                resolve();
            })
            .catch(() => {
                resolve();
            });
        });
    }

    /**
     * populate activities user with user data
     */
    getActivitiesUser(): void {
        const promiseList: Promise<any>[] = [];
        this.activities.forEach((activity) => {
            promiseList.push(this.doPopulateActivityUser(activity));
        });
        if (promiseList.length > 0) {
            Promise.all(promiseList).finally(() => {
                this.activitiesOnChanged.next(this.activities);
            });
        }
    }

    /**
     * Get activities
     */
    getActivities(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.activities,
                [this.user.id, '10']
            );
            this._http.GetObs(httpConfig, true).subscribe((activities: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.activities = activities;
                this.getActivitiesUser();
                this.activitiesOnChanged.next(this.activities);
                resolve(this.activities);
            }, reject);
        });
    }

    /**
     * Get friends
     */
    getFriends(): Promise<any[]> {
        return new Promise((resolve, reject) => {
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
                SrvApiEnvEnum.userSchema
            );
            this._http.GetObs(httpConfig, true).subscribe((userSchema: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.userSchema = userSchema;
                this.userSchemaOnChanged.next(this.userSchema);
                resolve(this.userSchema);
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
                [],
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
    getUserData(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userByUserId,
                [this.user.id]
            );

            this._http
                .GetObs(httpConfig, true)
                .subscribe((userData: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.userData = userData.data;
                    this.userDataOnChanged.next(this.userData);
                    resolve(this.userData);
                }, reject);
        });
    }

    updateUserData(userId: string, updateDTO: any): Promise<void>  {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userByUserId,
                [userId],
                updateDTO
            );

            this._http
                .PatchObs(httpConfig, true)
                .subscribe((resp: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    this.getUserData();
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
            this._http.GetObs(httpConfig, true).subscribe((userTimelineDTO: any) => {
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
     * Get basic user data
     */
    getBasicUserData(userId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.basicUserByUserId,
                [userId]
            );

            this._http
                .GetObs(httpConfig, true)
                .subscribe((userData: any) => {
                    this._authTokenSession.checkAuthTokenStatus();
                    resolve(userData);
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
            this._http.GetObs(httpConfig, true).subscribe((userTimelineCommentDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.userTimelineCommentDTO = userTimelineCommentDTO;
                this.userTimelineCommentDTOOnChanged.next(this.userTimelineCommentDTO);
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
            this._http.GetObs(httpConfig, true).subscribe((updUserTimelineCommentDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.updUserTimelineCommentDTO = updUserTimelineCommentDTO;
                this.updUserTimelineCommentDTOOnChanged.next(this.updUserTimelineCommentDTO);
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
            this._http.GetObs(httpConfig, true).subscribe((userTimelineCommentSchema: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.userTimelineCommentSchema = userTimelineCommentSchema;
                this.userTimelineCommentSchemaOnChanged.next(this.userTimelineCommentSchema);
                resolve(this.userTimelineCommentSchema);
            }, reject);
        });
    }
}
