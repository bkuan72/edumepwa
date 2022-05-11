import { LocalStoreVarEnum } from '../../shared/local-store-var-enum';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterDTO } from '../../dtos/register-dto';
import { LoginDTO } from '../../dtos/login-dto';
import { SrvApiEnvEnum } from '../../shared/SrvApiEnvEnum';
import { Injectable } from '@angular/core';
import { SrvHttpService } from '../http-connect/srv-http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    public authUserOnChange: BehaviorSubject<any>;
    rememberMe: boolean;


    renewCookieObserver: Observable<boolean>;
    renewingToken: boolean;

    constructor(
        private _http: SrvHttpService,
        private _logger: LoggerService,
    ) {
        this.rememberMe = true;
        this.authUserOnChange = new BehaviorSubject<any>(undefined);
        const usr = JSON.parse(localStorage.getItem(LocalStoreVarEnum.USER));
        if (usr && usr !== null) {
            this.authUserOnChange.next(usr);
        } else {
            this.authUserOnChange.next(undefined);
        }
    }

    public get currentAuthUser(): any {
        return this.authUserOnChange.value;
    }

    resetAuthUser = () => {
        localStorage.removeItem(LocalStoreVarEnum.USER);
        this.authUserOnChange.next(undefined);
    }

    registerNewUser = (registerDTO: RegisterDTO): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.register,
                undefined,
                registerDTO
            );
            this._http
                .Post(httpConfig, false)
                .then((responseBody) => {
                    localStorage.setItem(
                        LocalStoreVarEnum.USER,
                        JSON.stringify(responseBody)
                    );
                    this.authUserOnChange.next(responseBody);
                    resolve(true);
                })
                .catch((res: HttpErrorResponse) => {
                    this._logger.error('Error Registering User', res);
                    reject(false);
                });
        });
    }

    renewAuthToken = (): Promise<any> => {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.renewToken
            );
            this._http
                .Post(httpConfig, false)
                .then((responseBody) => {
                    localStorage.setItem(
                        LocalStoreVarEnum.USER,
                        JSON.stringify(responseBody)
                    );
                    this.authUserOnChange.next(responseBody);
                    resolve(responseBody);
                })
                .catch((res: HttpErrorResponse) => {
                    this._logger.error('Error Renewing Auth Token', res);
                    reject(undefined);
                });
        });
    }

    login = (loginDTO: LoginDTO,
             rememberMe: boolean,
             setToken: (resp: any, rememberMe: boolean) => void): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.rememberMe = rememberMe;
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.login,
                undefined,
                loginDTO
            );
            this._http
                .Post(httpConfig, false)
                .then((responseBody) => {
                    localStorage.setItem(
                        LocalStoreVarEnum.USER,
                        JSON.stringify(responseBody)
                    );
                    setToken(responseBody, rememberMe);
                    this.authUserOnChange.next(responseBody);
                    resolve(responseBody);
                })
                .catch((res: HttpErrorResponse) => {
                    this._logger.error('Error Logging In', res);
                    reject(undefined);
                });
        });
    }

    logout = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.logout
            );
            this._http
                .Post(httpConfig, false)
                .then((res) => {
                    // remove user from local storage and set current user to undefined
                    this.resetAuthUser();
                    resolve(true);
                })
                .catch((res) => {
                    // remove user from local storage and set current user to undefined
                    this.resetAuthUser();
                    this._logger.error('Error Logging Out', res);
                    reject(false);
                });
        });
    }


    emailConfirmation(email: string, regConfirmKey: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.regConfirmation,
                [email, regConfirmKey]
            );
            this._http
                .Get(httpConfig, false)
                .then((res) => {
                    resolve();
                })
                .catch((res) => {
                    this._logger.error('Error Confirming Email', res);
                    reject();
                });
        });
    }

    emailDeviceConfirmation(email: string, deviceUuid: string, regConfirmKey: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.deviceRegConfirmation,
                [email, deviceUuid, regConfirmKey]
            );
            this._http
                .Get(httpConfig, false)
                .then((res) => {
                    resolve();
                })
                .catch((res) => {
                    this._logger.error('Error Confirming Device Uuid', res);
                    reject();
                });
        });
    }

    resetPasswordConfirmation(email: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.resetPassword,
                [email]
            );
            this._http
                .Get(httpConfig, false)
                .then((res) => {
                    resolve();
                })
                .catch((res) => {
                    this._logger.error('Error Resetting Password', res);
                    reject();
                });
        });
    }

    validResetPasswordKey(
        email: string,
        resetPasswordKey: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.validResetPasswordKey,
                [email, resetPasswordKey]
            );
            this._http
                .Get(httpConfig, false)
                .then((res: { valid: boolean }) => {
                    if (res.valid) {
                        resolve();
                    } else {
                        this._logger.error('Invalid Reset Password Key', res);
                        reject();
                    }
                })
                .catch((res) => {
                    this._logger.error('Error Reset Email Password', res);
                    reject();
                });
        });
    }

    updateUserPassword(
        email: string,
        resetPasswordKey: string,
        newPassword: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const httpConfig = this._http.getSrvHttpConfig(
                SrvApiEnvEnum.newPasswordConfirmation,
                [email, resetPasswordKey, newPassword]
            );
            this._http
                .Get(httpConfig, false)
                .then((res) => {
                    resolve();
                })
                .catch((res) => {
                    this._logger.error('Error Reset Email Password', res);
                    reject();
                });
        });
    }

    setAuthUserAvatar(avatar: string): void {
        this.currentAuthUser.avatar = avatar;
        this.authUserOnChange.next(this.currentAuthUser);
    }
}
