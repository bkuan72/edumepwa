import { timeline } from 'console';
import { takeUntil } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { SrvHttpService } from 'app/services/http-connect/srv-http.service';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { SrvApiEnvEnum } from 'app/shared/SrvApiEnvEnum';


export interface TimelinePostMediaIfc {
    type: string;
    preview?: string;
    embed?: string;

}
export interface TimelinePostIfc  {
    post_user_id: string;
    timeline_user_id: string;
    message: string;
    medias: TimelinePostMediaIfc[];
    location: {
        lat: number;
         lng: number;
    };
    comment: string;
}

export interface PostMediaIfc {
    type: string;
    preview: string;
    embed: string;
    post_id: string;
}

@Injectable()
export class TimelineService implements OnDestroy {
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(private _http: SrvHttpService,
                private _auth: AuthTokenSessionService) {

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


    doPostToTimeline(post: TimelinePostIfc): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            const postDate = new Date();
            const postDTO = {
                id: '',
                post_date: postDate.toISOString(),
                post_type: 'post',
                message: post.message,
                user_id: post.post_user_id,
                status: 'OK'
            };
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userPost,
                undefined,
                postDTO
            );
            this._http.Post(httpConfig, true)
            .then((respPostDTO: any) => {
                this._auth.checkAuthTokenStatus();
                postDTO.id = respPostDTO.id;
                const userTimelineDTO = {
                    id: '',
                    status: 'OK',
                    timeline_user_id: post.timeline_user_id,
                    post_user_id: post.post_user_id,
                    post_date: postDTO.post_date,
                    post_id: postDTO.id
                };
                const userTimelineHttpConfig = this._http.getSrvHttpConfig(
                    SrvApiEnvEnum.userTimelines,
                    undefined,
                    userTimelineDTO
                );
                this._http.Post(userTimelineHttpConfig, true)
                .then((respUserTimelineDTO: any) => {
                    resolve(respUserTimelineDTO);
                })
                .catch (() => {
                    reject();
                });

            })
            .catch(() => {
                reject();
            });


        });
    }

    doPostMedia(postUserId: string,
                postId: string,
                media: TimelinePostMediaIfc): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            const postMediaDTO = {
                id: '',
                type: media.type,
                preview: media.preview,
                post_id: postId,
                user_id: postUserId,
                status: 'OK'
            };
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.postMedia,
                undefined,
                postMediaDTO
            );
            this._http.Post(httpConfig, true)
            .then((respPostMediaDTO: any) => {
                this._auth.checkAuthTokenStatus();
                resolve(respPostMediaDTO);
            })
            .catch(() => {
                reject();
            });


        });
    }

    doPostCommentToTimeline(
        userId: string,
        timelineId: string,
        postId: string,
        comment: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const commentDate = new Date();
            const commentDTO = {
                id: '',
                status: 'OK',
                timeline_id: timelineId,
                post_id: postId,
                user_id: userId,
                date_comment: commentDate.toISOString(),
                message: comment
            };
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userTimelineComments,
                undefined,
                commentDTO
            );
            this._http.Post(httpConfig, true)
            .then((respPostDTO: any) => {
                this._auth.checkAuthTokenStatus();
                resolve();
            })
            .catch(() => {
                reject();
            });

        });
    }


    doFindTimelineUserLikeActivity(
        timelineId: string,
        userId: string
    ): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.findUserTimelineLikeActivity,
                [
                    timelineId,
                    userId
                ]
            );
            this._http.Get(httpConfig, true)
            .then((respActivityDTO: any) => {
                this._auth.checkAuthTokenStatus();
                resolve(respActivityDTO);
            })
            .catch(() => {
                reject(undefined);
            });
        });
    }

    addTimelineLikeActivity(
        timelineUserId: string,
        userId: string,
        timelineId: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userActivitiesLikes,
                undefined,
                {
                    timeline_user_id: timelineUserId,
                    user_id: userId,
                    timeline_id: timelineId,
                    message: 'like your post'
                }
            );
            this._http.Post(httpConfig, true)
            .then((respActivityDTO: any) => {
                this._auth.checkAuthTokenStatus();
                resolve();
            })
            .catch(() => {
                reject();
            });
        });
    }

    removeActivity(
        activityId: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userActivityRemove,
                [activityId]
            );
            this._http.Put(httpConfig, true)
            .then((activityIdDTO: any) => {
                this._auth.checkAuthTokenStatus();
                resolve();
            })
            .catch(() => {
                reject();
            });
        });
    }

    decrementTimelineLikes(
        timelineId: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userTimelineUnlike,
                [timelineId]
            );
            this._http.Put(httpConfig, true)
            .then((respActivityDTO: any) => {
                this._auth.checkAuthTokenStatus();
                resolve();
            })
            .catch(() => {
                reject();
            });
        });
    }
    incrementTimelineLikes(
        timelineId: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userTimelineLike,
                [timelineId]
            );
            this._http.Put(httpConfig, true)
            .then((respActivityDTO: any) => {
                this._auth.checkAuthTokenStatus();
                resolve();
            })
            .catch(() => {
                reject();
            });
        });
    }

    doToggleTimelineLike(
        timelineUserId: string,
        userId: string,
        timelineId: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            this.doFindTimelineUserLikeActivity(timelineId, userId)
            .then((respActivityDTO: any[]) => {
                this._auth.checkAuthTokenStatus();
                if (respActivityDTO.length > 0) {
                    this.removeActivity(respActivityDTO[0].id).then(() => {
                        this.decrementTimelineLikes(timelineId).finally(() => {
                            resolve();
                        }).catch(() => { reject(); });
                    }).catch(() => { reject(); });
                } else {
                    this.incrementTimelineLikes(timelineId).then(() => {
                        this.addTimelineLikeActivity(timelineUserId, userId, timelineId).then(() => {
                            resolve();
                        }).catch(() => { reject(); });
                    }).catch(() => { reject(); });
                }
            })
            .catch(() => {
                reject();
            });

        });
    }
}
