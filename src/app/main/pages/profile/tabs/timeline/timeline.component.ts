import { CommonFn } from './../../../../../shared/common-fn';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

import { ProfileService } from '../../profile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector     : 'profile-timeline',
    templateUrl  : './timeline.component.html',
    styleUrls    : ['./timeline.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ProfileTimelineComponent implements OnInit, OnDestroy
{
    timeline: any[];
    activities: any[];
    friends: any[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ProfileService} _profileService
     */
    constructor(
        private _profileService: ProfileService,
        public fn: CommonFn
    )
    {
        this.timeline = [];
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
    ngOnInit(): void
    {
        this._profileService.timelineOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(timeline => {
                this.timeline = timeline;
                this.doUpdateTimeLineUser( );
            });
        this._profileService.activitiesOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(activities => {
            this.activities = activities;
        });
        this._profileService.friendsOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(friends => {
            this.friends = friends;
            this.doUpdateTimeLineUser( );
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getUser(userId: string): any {
        let fr: any;
        this.friends.some((friend) => {
            if (friend.id === userId) {
                fr = friend;
                return true;
            }
        });
        return fr;
    }

    doUpdateTimeLineUser( ): void {
        if (this.friends && this.timeline) {
            this.timeline.forEach((post) => {
                if (post.user === undefined) {
                    if (post.user_id === this._profileService.user.id) {
                        post = this.fn.defineProperty(post, 'user', {
                                                                        name: this._profileService.user.user_name,
                                                                        avatar: this._profileService.user.avatar
                                                                    }
                            );
                    } else {
                        const user  = this.getUser(post.user_id);
                        if (user) {
                            post = this.fn.defineProperty(post, 'user', {
                                                                            name: user.user_name,
                                                                            avatar: user.avatar
                                                                        }
                                );
                        }
                    }
                }
            });
        }
    }
}
