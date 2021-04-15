import { CommonFn } from 'app/shared/common-fn';
import { UploadFileIfc } from '../../components/image-drop-upload/image-drop-upload.component';
import { Injectable, OnDestroy } from '@angular/core';
import { LoggerService } from '../logger/logger.service';
import { SrvHttpService } from '../http-connect/srv-http.service';
import { AuthTokenSessionService } from '../auth-token-session/auth-token-session.service';
import { SrvApiEnvEnum } from 'app/shared/SrvApiEnvEnum';
import { BehaviorSubject, Subject } from 'rxjs';
import { info } from 'console';

export enum UploadMode {
    UserMedia,
    AccountMedia,
    GroupMedia,
    UnknownMedia,
}

@Injectable({
    providedIn: 'root',
})
export class MediaService implements OnDestroy {
    uploadMode: UploadMode = UploadMode.UnknownMedia;
    user: any;
    account: any;
    group: any;

    photosVideos: any[] = [];

    photosVideosOnChanged: BehaviorSubject<any>;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _logger: LoggerService,
        private _http: SrvHttpService,
        private _authTokenSession: AuthTokenSessionService,
        private _fn: CommonFn,
        private _uploadMode: UploadMode
    ) {
        this.uploadMode = this._uploadMode;
        this.photosVideosOnChanged = new BehaviorSubject(this.photosVideos);

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    initMediaService(
        mode: UploadMode,
        user: any,
        account: any,
        group: any
    ): void {
        this.uploadMode = mode;
        this.user = user;
        this.account = account;
        this.group = group;
        this.photosVideos = [];
        this.photosVideosOnChanged.next(this.photosVideos);
    }

    uploadFileToServer(
        periodId: string,
        period: string,
        infoStr: string,
        uploadFile: UploadFileIfc
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            switch (this.uploadMode) {
                case UploadMode.UserMedia:
                    this.uploadUserMedia(
                        periodId,
                        this.user.id,
                        uploadFile
                    )
                        .then(() => {
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                    break;
                case UploadMode.AccountMedia:
                    this.uploadAccountMedia(
                        periodId,
                        this.account.id,
                        uploadFile
                    )
                        .then(() => {
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                    break;
                case UploadMode.GroupMedia:
                    this.uploadAccountGroupMedia(
                        periodId,
                        this.account.id,
                        this.group.id,
                        uploadFile
                    )
                        .then(() => {
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                    break;
                default:
                    this._logger.error('Upload Mode Not Defined');
                    reject();
                    break;
            }
        });
    }

    uploadUserMedia(
        periodId: string,
        userId: string,
        uploadFile: UploadFileIfc
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const uploadDate = new Date();
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userMedias,
                undefined,
                {
                    userMediaPeriod_id: periodId,
                    user_id: userId,
                    upload_date: uploadDate.toISOString(),
                    media_type: 'image',
                    filename: uploadFile.name,
                    title: uploadFile.title,
                    preview: uploadFile.img,
                    fullImage: uploadFile.fullImage,
                }
            );
            this._http.PostObs(httpConfig, true).subscribe((userMediaDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();

                resolve();
            }, reject);
        });
    }

    uploadAccountMedia(
        periodId: string,
        accountId: string,
        uploadFile: UploadFileIfc
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const uploadDate = new Date();
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountGroupMedias,
                undefined,
                {
                    accountGroupMediaPeriod_id: periodId,
                    account_id: accountId,
                    upload_date: uploadDate.toISOString(),
                    media_type: 'image',
                    filename: uploadFile.name,
                    title: uploadFile.title,
                    preview: uploadFile.img,
                    fullImage: uploadFile.fullImage,
                }
            );
            this._http.PostObs(httpConfig, true).subscribe((userMediaDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();

                resolve();
            }, reject);
        });
    }

    uploadAccountGroupMedia(
        periodId: string,
        accountId: string,
        groupId: string,
        uploadFile: UploadFileIfc
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const uploadDate = new Date();
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountGroupMedias,
                undefined,
                {
                    accountGroupMediaPeriod_id: periodId,
                    account_id: accountId,
                    group_id: groupId,
                    upload_date: uploadDate.toISOString(),
                    media_type: 'image',
                    filename: uploadFile.name,
                    title: uploadFile.title,
                    preview: uploadFile.img,
                    fullImage: uploadFile.fullImage,
                }
            );
            this._http.PostObs(httpConfig, true).subscribe((userMediaDTO: any) => {
                this._authTokenSession.checkAuthTokenStatus();

                resolve();
            }, reject);
        });
    }

    uploadMediaPeriodToServer(
        period: string,
        infoStr: string,
        uploadFile: UploadFileIfc
    ): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            switch (this.uploadMode) {
                case UploadMode.UserMedia:
                    this.uploadUserMediaPeriod(
                        period,
                        infoStr,
                        this.user.id,
                        uploadFile
                    )
                        .then((userMediaPeriod) => {
                            resolve(userMediaPeriod.id);
                        })
                        .catch(() => {
                            reject();
                        });
                    break;
                case UploadMode.AccountMedia:
                    this.uploadAccountMediaPeriod(
                        period,
                        infoStr,
                        this.account.id,
                        uploadFile
                    )
                        .then((userMediaPeriod) => {
                            resolve(userMediaPeriod.id);
                        })
                        .catch(() => {
                            reject();
                        });
                    break;
                case UploadMode.GroupMedia:
                    this.uploadAccountGroupMediaPeriod(
                        period,
                        infoStr,
                        this.group.account_id,
                        this.group.id,
                        uploadFile
                    )
                        .then((userMediaPeriod) => {
                            resolve(userMediaPeriod.id);
                        })
                        .catch(() => {
                            reject();
                        });
                    break;
                default:
                    this._logger.error('Upload Mode Not Defined');
                    reject();
                    break;
            }
        });
    }

    uploadUserMediaPeriod(
        period: string,
        infoStr: string,
        userId: string,
        uploadFile: UploadFileIfc
    ): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            const uploadDate = new Date();
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.userMediaPeriods,
                undefined,
                {
                    user_id: userId,
                    period: period,
                    info: infoStr,
                    upload_date: uploadDate.toISOString(),
                    filename: uploadFile.name,
                    media_type: 'image',
                    title: uploadFile.title,
                    preview: uploadFile.img,
                    fullImage: uploadFile.fullImage,

                }
            );
            this._http.PostObs(httpConfig, true).subscribe((userMediaPeriod: any) => {
                this._authTokenSession.checkAuthTokenStatus();

                resolve(userMediaPeriod);
            }, reject);
            });
    }

    uploadAccountMediaPeriod(
        period: string,
        infoStr: string,
        accountId: string,
        uploadFile: UploadFileIfc
    ): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            const uploadDate = new Date();
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountGroupMediaPeriods,
                undefined,
                {
                    account_id: accountId,
                    period: period,
                    info: infoStr,
                    upload_date: uploadDate.toISOString(),
                    filename: uploadFile.name,
                    media_type: 'image',
                    title: uploadFile.title,
                    preview: uploadFile.img,
                    fullImage: uploadFile.fullImage,

                }
            );
            this._http.PostObs(httpConfig, true).subscribe((accountMediaPeriod: any) => {
                this._authTokenSession.checkAuthTokenStatus();

                resolve(accountMediaPeriod);
            }, reject);
            });
    }

    uploadAccountGroupMediaPeriod(
        period: string,
        infoStr: string,
        accountId: string,
        groupId: string,
        uploadFile: UploadFileIfc
    ): Promise<any | undefined> {
        return new Promise((resolve, reject) => {
            const uploadDate = new Date();
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.accountGroupMediaPeriods,
                undefined,
                {
                    account_id: accountId,
                    group_id: groupId,
                    period: period,
                    info: infoStr,
                    upload_date: uploadDate.toISOString(),
                    filename: uploadFile.name,
                    media_type: 'image',
                    title: uploadFile.title,
                    preview: uploadFile.img,
                    fullImage: uploadFile.fullImage,

                }
            );
            this._http.PostObs(httpConfig, true).subscribe((accountGroupMediaPeriod: any) => {
                this._authTokenSession.checkAuthTokenStatus();

                resolve(accountGroupMediaPeriod);
            }, reject);
            });
    }

    /**
     * Get photos & videos
     */
    getPhotosVideos(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            let httpConfig;
            switch(this.uploadMode) {
                case UploadMode.UserMedia:
                    httpConfig = this._http.getSrvHttpConfig(
                        SrvApiEnvEnum.userMediaPeriodsByUserId,
                        [this.user.id]
                    );
                    break;
                case UploadMode.AccountMedia:
                    httpConfig = this._http.getSrvHttpConfig(
                        SrvApiEnvEnum.accountGroupMediaPeriodsByAccountId,
                        [this.account.id]
                    );
                    break;
                case UploadMode.GroupMedia:
                    httpConfig = this._http.getSrvHttpConfig(
                        SrvApiEnvEnum.accountGroupMediaPeriodsByGroupId,
                        [this.group.id]
                    );
                    break;
                case UploadMode.UnknownMedia:
                    this._logger.error('Upload Mode Not Defined');
                    reject();
                    return;
                    break;
            }

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
     * Get Period photos & videos
     */
    getMediaPeriodPhotosVideos(period: any): Promise<any[]> {
        return new Promise((resolve, reject) => {
            let httpConfig;
            switch(this.uploadMode) {
                case UploadMode.UserMedia:
                    httpConfig = this._http.getSrvHttpConfig(
                        SrvApiEnvEnum.userMediasByUserMediaPeriodId,
                        [period.id]
                    );
                    break;
                case UploadMode.AccountMedia:
                case UploadMode.GroupMedia:
                    httpConfig = this._http.getSrvHttpConfig(
                        SrvApiEnvEnum.accountGroupMediasByAccountGroupMediaPeriodId,
                        [period.id]
                    );
                    break;
                case UploadMode.UnknownMedia:
                    this._logger.error('Upload Mode Not Defined');
                    reject();
                    return;
                    break;
            }



            this._http
                .GetObs(httpConfig, true)
                .subscribe((photosVideos: any) => {
                    resolve(photosVideos);
                }, reject);
        });
    }

    getFullImage(mediaId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let apiPath = '';
            switch (this.uploadMode) {
                case UploadMode.UserMedia:
                    apiPath = SrvApiEnvEnum.userMediaFullImageById;
                    break;
                case UploadMode.AccountMedia:
                    apiPath = SrvApiEnvEnum.accountGroupMediaFullImageById;
                    break;
                case UploadMode.GroupMedia:
                    apiPath = SrvApiEnvEnum.accountGroupMediaFullImageById;
                    break;
                default:
                    reject();
                    return;
            }
            const httpConfig = this._http.getSrvHttpConfig(
                apiPath,
                [mediaId]
            );

            this._http
                .GetObs(httpConfig, true)
                .subscribe((fullImage: any) => {
                    resolve(fullImage);
                }, reject);
        });
    }
}
