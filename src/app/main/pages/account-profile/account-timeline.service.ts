import { timeline } from 'console';
import { takeUntil } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { SrvHttpService } from 'app/services/http-connect/srv-http.service';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { SrvApiEnvEnum } from 'app/shared/SrvApiEnvEnum';
import { ActivityService } from 'app/services/activity/activity.service';


export interface AccountTimelinePostMediaIfc {
    type: string;
    preview?: string;
    embed?: string;

}
export interface AccountTimelinePostIfc  {
    post_user_id: string;
    timeline_account_id: string;
    message: string;
    medias: AccountTimelinePostMediaIfc[];
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
export class AccountTimelineService implements OnDestroy {
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(private _http: SrvHttpService,
                private _auth: AuthTokenSessionService,
                private _activityService: ActivityService) {

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


    doPostToTimeline(post: AccountTimelinePostIfc): Promise<any | undefined> {
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
                const accountTimelineDTO = {
                    id: '',
                    status: 'OK',
                    timeline_account_id: post.timeline_account_id,
                    post_user_id: post.post_user_id,
                    post_date: postDTO.post_date,
                    post_id: postDTO.id
                };
                const accountTimelineHttpConfig = this._http.getSrvHttpConfig(
                    SrvApiEnvEnum.accountTimeline,
                    undefined,
                    accountTimelineDTO
                );
                this._http.Post(accountTimelineHttpConfig, true)
                .then((respAccountTimelineDTO: any) => {
                    resolve(respAccountTimelineDTO);
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
                media: AccountTimelinePostMediaIfc): Promise<any | undefined> {
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
                SrvApiEnvEnum.accountGroupTimelineComments,
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


    doFindTimelineAccountLikeActivity(
        timelineId: string,
        accountId: string
    ): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.findAccountTimelineLikeActivity,
                [
                    timelineId,
                    accountId
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
        timelineAccountId: string,
        userId: string,
        timelineId: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountActivitiesLikes,
                undefined,
                {
                    timeline_user_id: timelineAccountId,
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


    decrementTimelineLikes(
        timelineId: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountGroupTimelineUnlike,
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
                SrvApiEnvEnum.accountGroupTimelineLike,
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
        timelineAccountId: string,
        userId: string,
        timelineId: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            this.doFindTimelineAccountLikeActivity(timelineId, userId)
            .then((respActivityDTO: any[]) => {
                this._auth.checkAuthTokenStatus();
                if (respActivityDTO.length > 0) {
                    this._activityService.deleteAccountGroupActivity(respActivityDTO[0].id).then(() => {
                        this.decrementTimelineLikes(timelineId).finally(() => {
                            resolve();
                        }).catch(() => { reject(); });
                    }).catch(() => { reject(); });
                } else {
                    this.incrementTimelineLikes(timelineId).then(() => {
                        this.addTimelineLikeActivity(timelineAccountId, userId, timelineId).then(() => {
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
