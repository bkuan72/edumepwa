import { SessionService } from './../../../services/session/session.service';
import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { SrvHttpService } from 'app/services/http-connect/srv-http.service';
import { SrvApiEnvEnum } from 'app/shared/SrvApiEnvEnum';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';

@Injectable()
export class ProfileService implements Resolve<any> {
    userDTO: any;
    updUserDTO: any;
    userSchema: any;
    user: any;
    userData: any;
    timeline: any;
    about: any;
    photosVideos: any;

    activities: any;
    friends: any;
    groups: any;
    countries: any;
    titles: any;

    timelineOnChanged: BehaviorSubject<any>;
    aboutOnChanged: BehaviorSubject<any>;
    photosVideosOnChanged: BehaviorSubject<any>;
    activitiesOnChanged: BehaviorSubject<any>;
    friendsOnChanged: BehaviorSubject<any>;
    groupsOnChanged: BehaviorSubject<any>;
    userDTOOnChanged: BehaviorSubject<any>;
    updUserDTOOnChanged: BehaviorSubject<any>;
    userSchemaOnChanged: BehaviorSubject<any>;
    countriesOnChanged: BehaviorSubject<any>;
    userDataOnChanged: BehaviorSubject<any>;
    titlesOnChanged: BehaviorSubject<any>;

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
        this.timeline = [];
        this.about = {};
        this.photosVideos = [];
        this.activities = [];
        this.friends = [];
        this.groups = [];
        this.countries = [];
        this.titles = [];

        // Set the defaults
        this.timelineOnChanged = new BehaviorSubject(this.timeline);
        this.aboutOnChanged = new BehaviorSubject(this.about);
        this.photosVideosOnChanged = new BehaviorSubject(this.photosVideos);
        this.activitiesOnChanged = new BehaviorSubject(this.activities);
        this.friendsOnChanged = new BehaviorSubject(this.friends);
        this.groupsOnChanged = new BehaviorSubject(this.groups);
        this.userDTOOnChanged = new BehaviorSubject(this.userDTO);
        this.updUserDTOOnChanged = new BehaviorSubject(this.userDTO);
        this.userSchemaOnChanged = new BehaviorSubject(this.userSchema);
        this.countriesOnChanged = new BehaviorSubject(this.countries);
        this.titlesOnChanged = new BehaviorSubject(this.titles);
        this.userDataOnChanged = new BehaviorSubject(this.userData);
        this.doLoadUserProfile();
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
                if (this._authTokenSession.adminUser) {
                    this.getUserDTO();
                    this.getUpdUserDTO();
                    this.getUserSchema();
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
     * Get timeline
     */
    getTimeline(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.timeline,
                [this.user.id, '10']
            );
            this._http.GetObs(httpConfig, true).subscribe((timeline: any) => {
                this._authTokenSession.checkAuthTokenStatus();
                this.timeline = timeline;
                this.timelineOnChanged.next(this.timeline);
                resolve(this.timeline);
            }, reject);
        });
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
}
