import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppSettings } from '../../shared/app-settings';
import { SrvHttpService } from '../http-connect/srv-http.service';
import { catchError, map } from 'rxjs/operators';

const SETTINGS_JSON_LOCATION = 'assets/app-settings.json';
const SETTINGS_KEY = 'configuration';
let   SETTINGS_WEBAPI_LOCATION = '/api/config';

@Injectable({
    providedIn: 'root',
})
export class AppSettingsService {
    constructor(private http: SrvHttpService) {}

    getSettings(): Observable<AppSettings> {
        const settings = localStorage.getItem(SETTINGS_KEY);

        if (settings) {
            return of(JSON.parse(settings));
        } else {
            const httpConfig = this.http.getSrvHttpConfig(
                SETTINGS_JSON_LOCATION,
                [],
                undefined,
                'application/json'
            );
            return this.http.GetObs(httpConfig, true).pipe(
                map((response) => response.json()),
                catchError(this.handleMissingJSONSettingsConfigErrors)
            );
        }
    }

    private handleMissingJSONSettingsConfigErrors(error: any): Observable<AppSettings> {
        // Log the error to the console
        switch (error.status) {
            case 404:
                console.error('Can\'t find file: ' + SETTINGS_JSON_LOCATION);
                break;
            default:
                console.error(error);
                break;
        }
        // Return default configuration values
        const settings = new AppSettings();
        SETTINGS_WEBAPI_LOCATION = settings.settingsApi;
        const httpConfig = this.http.getSrvHttpConfig(
            SETTINGS_WEBAPI_LOCATION,
            [],
            undefined,
            'application/json'
        );
        return this.http.GetObs(httpConfig, true).pipe(
            map((response) => response.json()),
            catchError(this.handleMissingServerSettingsConfigErrors)
        );

    }



    private handleMissingServerSettingsConfigErrors(error: any): Observable<AppSettings> {
        // Log the error to the console
        switch (error.status) {
            case 404:
                console.error('Can\'t find file: ' + SETTINGS_WEBAPI_LOCATION);
                break;
            default:
                console.error(error);
                break;
        }
        // Return default configuration
        return of<AppSettings>(new AppSettings());
    }



    saveSettings = (settings: AppSettings) => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    deleteSettings(): void {
        localStorage.removeItem(SETTINGS_KEY);
      }
}
