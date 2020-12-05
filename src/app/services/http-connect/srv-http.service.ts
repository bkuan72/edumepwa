import { AlertService } from './../alert/alert.service';
import { AppSettingsService } from './../app-settings/app-settings.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { isUndefined } from 'lodash';
import { SrvAuthTokenService } from 'app/services/srv-cookie/srv-auth-token.service';
import { Observable, throwError } from 'rxjs';
import { AppSettings } from 'app/shared/app-settings';

export class HttpConfig {
    private _withCredentials: boolean;
    public get withCredentials(): boolean {
        return this._withCredentials;
    }
    public set withCredentials(value: boolean) {
        this._withCredentials = value;
    }
    private _srvApi: boolean;
    public get srvApi(): boolean {
        return this._srvApi;
    }
    public set srvApi(value: boolean) {
        this._srvApi = value;
    }
    private _url: string;
    public get url(): string {
        return this._url;
    }
    public set url(value: string) {
        this._url = value;
    }
    private _data: any;
    public get data(): any {
        return this._data;
    }
    public set data(value: any) {
        this._data = value;
    }
    private _headers: {
        contentType: string;
    };
    public get headers(): {
        contentType: string;
    } {
        return this._headers;
    }
    public set headers(value: {
        contentType: string;
    }) {
        this._headers = value;
    }


    private _requestTimeStamp: number;
    public get requestTimeStamp(): number {
        return this._requestTimeStamp;
    }
    public set requestTimeStamp(value: number) {
        this._requestTimeStamp = value;
    }
    private _responseTimeStamp: number;
    public get responseTimeStamp(): number {
        return this._responseTimeStamp;
    }
    public set responseTimeStamp(value: number) {
        this._responseTimeStamp = value;
    }

    constructor(url: string, httpData: any) {
        this.srvApi = false;
        this.url = url;
        this.data = httpData;
        this.withCredentials = false;
        this.headers = { contentType: 'application/json; charset=utf-8' };
    }
}

@Injectable({
    providedIn: 'root',
})
export class SrvHttpService {
    private settings: AppSettings;
    private serverUrl: string;
    constructor(
        private _httpClient: HttpClient,
        private _authToken: SrvAuthTokenService,
        private _appSettings: AppSettingsService,
        private alert: AlertService
    ) {
        this.serverUrl = 'http://localhost:3300';
        this._appSettings.getSettings().subscribe(settings => this.settings = settings, () => null, () => {
                this.serverUrl = this.settings.defaultUrl;
            });
    }

    getSrvHttpConfig = (
        apiPath: string,
        paramArray?: string[],
        httpData?: any,
        contentType?: string,
        withCredentials?: boolean
    ): HttpConfig => {
        let httpUrl = this.serverUrl + apiPath;
        if (!isUndefined(paramArray) && paramArray.length > 0) {
            let first = true;
            paramArray.forEach((paramStr) => {
                if (first) {
                    httpUrl += '?';
                    first = false;
                } else {
                    httpUrl += '&';
                }
                httpUrl += paramStr;
            });
        }
        const config = new HttpConfig(httpUrl, httpData);
        config.srvApi = true;
        if (contentType) {
            config.headers.contentType = contentType;
        }
        if (withCredentials !== undefined) {
            config.withCredentials = withCredentials;
        }
        return config;
    }

    getHttpConfig = (
        url: string,
        paramArray: string[],
        httpData: any,
        contentType?: string
    ): HttpConfig => {
        let httpUrl = url;
        if (!isUndefined(paramArray) && paramArray.length > 0) {
            let first = true;
            paramArray.forEach((paramStr) => {
                if (first) {
                    httpUrl += '?';
                    first = false;
                } else {
                    httpUrl += '&';
                }
                httpUrl += paramStr;
            });
        }
        const config = new HttpConfig(httpUrl, httpData);
        if (!isUndefined(contentType)) {
            config.headers.contentType = contentType;
        }
        return config;
    }

    GetObs = (srvConfig: HttpConfig, silentOnError: boolean): Observable<any> => {
        let httpHdr: HttpHeaders = new HttpHeaders();
        if (srvConfig.srvApi && !this._authToken.isUndefined()) {
            httpHdr = httpHdr.append('Authorization', this._authToken.getAuthToken());
        }
        srvConfig.requestTimeStamp = new Date().getTime();
        return this._httpClient
            .get(srvConfig.url, { headers: httpHdr, withCredentials: srvConfig.withCredentials });
    }


    Get = (srvConfig: HttpConfig, silentOnError: boolean): Promise<object> => {
        return new Promise((resolve, reject) => {
            let httpHdr: HttpHeaders = new HttpHeaders();
            if (srvConfig.srvApi && !this._authToken.isUndefined()) {
                httpHdr = httpHdr.append('Authorization', this._authToken.getAuthToken());
            }
            srvConfig.requestTimeStamp = new Date().getTime();
            this._httpClient
                .get(srvConfig.url, { headers: httpHdr, observe: 'response', withCredentials: srvConfig.withCredentials })
                .subscribe(
                    (httpResponse: HttpResponse<object>) => {
                        // SUCCESS
                        srvConfig.responseTimeStamp = new Date().getTime();
                        resolve(httpResponse.body);
                    },
                    (httpError: HttpErrorResponse) => {
                        srvConfig.responseTimeStamp = new Date().getTime();
                        // FAILURE
                        if (!silentOnError) {
                            this.handleErrors(httpError);
                        }
                        reject(httpError);
                    }
                );
        });
    }

    Post = (srvConfig: HttpConfig, silentOnError: boolean): Promise<any> => {
        return new Promise((resolve, reject) => {
            let httpHdr: HttpHeaders = new HttpHeaders();
            if (srvConfig.srvApi && !this._authToken.isUndefined()) {
                httpHdr = httpHdr.append('Authorization', this._authToken.getAuthToken());
            }
            httpHdr = httpHdr.append(
                'Content-Type',
                srvConfig.headers.contentType
            );
            srvConfig.requestTimeStamp = new Date().getTime();
            this._httpClient
                .post(srvConfig.url, srvConfig.data, {
                    headers: httpHdr,
                    observe: 'response',
                    responseType: 'json',
                    withCredentials: srvConfig.withCredentials
                })
                .subscribe(
                    (httpResponse: HttpResponse<object>) => {
                        srvConfig.responseTimeStamp = new Date().getTime();
                        // SUCCESS
                        resolve(httpResponse.body);
                    },
                    (httpError: HttpErrorResponse) => {
                        srvConfig.responseTimeStamp = new Date().getTime();
                        // FAILURE
                        if (!silentOnError) {
                            this.handleErrors(httpError);
                        }
                        reject(httpError);
                    }
                );
        });
    }

    PostObs = (srvConfig: HttpConfig, silentOnError: boolean): Observable<any>  => {
            let httpHdr: HttpHeaders = new HttpHeaders();
            if (srvConfig.srvApi && !this._authToken.isUndefined()) {
                httpHdr = httpHdr.append('Authorization', this._authToken.getAuthToken());
            }
            httpHdr = httpHdr.append(
                'Content-Type',
                srvConfig.headers.contentType
            );
            srvConfig.requestTimeStamp = new Date().getTime();
            return this._httpClient
                .post(srvConfig.url, srvConfig.data, {
                    headers: httpHdr, withCredentials: srvConfig.withCredentials
                });
    }

    Put = (srvConfig: HttpConfig, silentOnError: boolean): Promise<any>  => {
        return new Promise((resolve, reject) => {
            let httpHdr: HttpHeaders = new HttpHeaders();
            if (srvConfig.srvApi && !this._authToken.isUndefined()) {
                httpHdr = httpHdr.append('Authorization', this._authToken.getAuthToken());
            }
            httpHdr = httpHdr.append(
                'Content-Type',
                srvConfig.headers.contentType
            );
            srvConfig.requestTimeStamp = new Date().getTime();
            this._httpClient
                .post(srvConfig.url, srvConfig.data, {
                    headers: httpHdr,
                    observe: 'response',
                    responseType: 'json',
                    withCredentials: srvConfig.withCredentials
                })
                .subscribe(
                    (httpResponse: HttpResponse<object>) => {
                        srvConfig.responseTimeStamp = new Date().getTime();
                        // SUCCESS
                        resolve(httpResponse.body);
                    },
                    (httpError: HttpErrorResponse) => {
                        srvConfig.responseTimeStamp = new Date().getTime();
                        // FAILURE
                        if (!silentOnError) {
                            this.handleErrors(httpError);
                        }
                        reject(httpError);
                    }
                );
        });


    }

    handleErrors = (httpError: HttpErrorResponse): void => {
        this.alert.warn(httpError.error);
    }
    handleObsErrors = (error: HttpErrorResponse): Observable<any> => {
        const errors: string[] = [];
        let msg = '';

        msg = 'Status: ' + error.status;
        msg += ' - Status Text: ' + error.statusText;
        if (error.error) {
            msg += ' - Exception Message: ' + error.error;
        }
        errors.push(msg);

        console.error('An error occurred', errors);
        return throwError(errors);
    }
}