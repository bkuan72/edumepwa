import { SrvApiEnvEnum } from './../../shared/SrvApiEnvEnum';
import { LocalStoreVarEnum } from './../../shared/local-store-var-enum';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppSettings } from '../../shared/app-settings';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AppSettingsService {
    settings: AppSettings;
    constructor(private _httpClient: HttpClient) {
        this._httpClient.get(
            SrvApiEnvEnum.SETTINGS_JSON_LOCATION
        ).subscribe((dfltSettings: AppSettings) => {
            this.settings = dfltSettings;
        })
    }

    getSettings(): Observable<any> {
        // const settings = localStorage.getItem(LocalStoreVarEnum.SETTINGS);
        // if (settings) {
        //     return of(JSON.parse(settings));
        // } 
        if (this.settings) {
            return of(this.settings);
        }
        else {
            return this._httpClient.get(
                SrvApiEnvEnum.SETTINGS_JSON_LOCATION
            );
        }
    }

    private handleMissingJSONSettingsConfigErrors(error: any): Observable<AppSettings> {
        // Log the error to the console
        switch (error.status) {
            case 404:
                console.error('Can\'t find file: ' + SrvApiEnvEnum.SETTINGS_JSON_LOCATION);
                break;
            default:
                console.error(error);
                break;
        }
        // Return default configuration values
        const settings = new AppSettings();
        return of(settings);
        // SETTINGS_WEBAPI_LOCATION = settings.settingsApi;
        // const httpConfig = this.http.getSrvHttpConfig(
        //     SETTINGS_WEBAPI_LOCATION,
        //     [],
        //     undefined,
        //     'application/json'
        // );
        // return this.http.GetObs(httpConfig, true).pipe(
        //     map((response) => response.json()),
        //     catchError(this.handleMissingServerSettingsConfigErrors)
        // );

    }



    // private handleMissingServerSettingsConfigErrors(error: any): Observable<AppSettings> {
    //     // Log the error to the console
    //     switch (error.status) {
    //         case 404:
    //             console.error('Can\'t find file: ' + SETTINGS_WEBAPI_LOCATION);
    //             break;
    //         default:
    //             console.error(error);
    //             break;
    //     }
    //     // Return default configuration
    //     return of<AppSettings>(new AppSettings());
    // }



    saveSettings = (settings: AppSettings) => {
        localStorage.setItem(LocalStoreVarEnum.SETTINGS, JSON.stringify(settings));
    }

    deleteSettings(): void {
        localStorage.removeItem(LocalStoreVarEnum.SETTINGS);
      }
}
