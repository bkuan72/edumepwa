import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from 'app/services/authentication/authentication.service';
import { SrvHttpService } from 'app/services/http-connect/srv-http.service';
import { SrvApiEnvEnum } from 'app/shared/SrvApiEnvEnum';

@Injectable()
export class ProfileService implements Resolve<any>
{
    user: any;
    timeline: any;
    about: any;
    photosVideos: any;

    activities: any;
    friends: any;
    groups: any;

    timelineOnChanged: BehaviorSubject<any>;
    aboutOnChanged: BehaviorSubject<any>;
    photosVideosOnChanged: BehaviorSubject<any>;
    activitiesOnChanged: BehaviorSubject<any>;
    friendsOnChanged: BehaviorSubject<any>;
    groupsOnChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _http
     */
    constructor(
        private _http: SrvHttpService,
        private _auth: AuthenticationService
    )
    {
        this.user = this._auth.userValue;
        // Set the defaults
        this.timelineOnChanged = new BehaviorSubject({});
        this.aboutOnChanged = new BehaviorSubject({});
        this.photosVideosOnChanged = new BehaviorSubject({});
        this.activitiesOnChanged = new BehaviorSubject({});
        this.friendsOnChanged = new BehaviorSubject({});
        this.groupsOnChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getTimeline(),
                this.getAbout(),
                this.getPhotosVideos(),
                this.getActivities(),
                this.getFriends(),
                this.getGroups()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get timeline
     */
    getTimeline(): Promise<any[]>
    {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.timeline,
                [this.user.id, '10']
                );
            this._http.GetObs(httpConfig, true)
                .subscribe((timeline: any) => {
                    this.timeline = timeline;
                    this.timelineOnChanged.next(this.timeline);
                    resolve(this.timeline);
                }, reject);
        });
    }

    /**
     * Get about
     */
    getAbout(): Promise<any[]>
    {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.about,
                [this.user.id]
                );
            this._http.GetObs(httpConfig, true)
                .subscribe((about: any) => {
                    this.about = about;
                    this.aboutOnChanged.next(this.about);
                    resolve(this.about);
                }, reject);
        });
    }

    /**
     * Get photos & videos
     */
    getPhotosVideos(): Promise<any[]>
    {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.media,
                    [this.user.id]
                    );

            this._http.GetObs(httpConfig, true)
                .subscribe((photosVideos: any) => {
                    this.photosVideos = photosVideos;
                    this.photosVideosOnChanged.next(this.photosVideos);
                    resolve(this.photosVideos);
                }, reject);
        });
    }


    /**
     * Get activities
     */
    getActivities(): Promise<any[]>
    {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.activities,
                [this.user.id, '10']
                );
            this._http.GetObs(httpConfig, true)
                .subscribe((activities: any) => {
                    this.activities = activities;
                    this.activitiesOnChanged.next(this.activities);
                    resolve(this.activities);
                }, reject);
        });
    }

    /**
     * Get friends
     */
    getFriends(): Promise<any[]>
    {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.friends,
                [this.user.id]
                );
            this._http.GetObs(httpConfig, true)
                .subscribe((friends: any) => {
                    this.friends = friends;
                    this.friendsOnChanged.next(this.friends);
                    resolve(this.friends);
                }, reject);
        });
    }

    /**
     * Get groups
     */
    getGroups(): Promise<any[]>
    {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(SrvApiEnvEnum.userGroups,
                [this.user.id]
                );
            this._http.GetObs(httpConfig, true)
                .subscribe((groups: any) => {
                    this.groups = groups;
                    this.groupsOnChanged.next(this.groups);
                    resolve(this.groups);
                }, reject);
        });
    }
}
