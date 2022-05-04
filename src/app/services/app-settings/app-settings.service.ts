import { LocalStoreVarEnum } from './../../shared/local-store-var-enum';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppSettings } from '../../shared/app-settings';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AppSettingsService {
    private settingsSubject: BehaviorSubject<any>;

    settings: AppSettings;


    constructor(private _httpClient: HttpClient) {
        this.settingsSubject = new BehaviorSubject<any>(new AppSettings());
        this.getSettings();
    }

    public get settingsValue(): AppSettings {
        return this.settingsSubject.value;
    }

    public get settingsObs(): Observable<AppSettings> {
        return this.settingsSubject.asObservable();
    }

    getSettings(): void {
        this.settings = new AppSettings();
        // Read environment variables from browser window
        const browserWindow = window || {};

        // Assign environment variables from browser window to env
        // In the current implementation, properties from env.js overwrite defaults from the EnvService.
        // If needed, a deep merge can be performed here to merge properties instead of overwriting them.
        for (const key in environment) {
            if (this.settings.hasOwnProperty(key)) {
                this.settings[key] = environment[key];
            }
        }
        this.settingsSubject.next(this.settings);
    }

    saveSettings = (settings: AppSettings) => {
        localStorage.setItem(LocalStoreVarEnum.SETTINGS, JSON.stringify(settings));
    }

    deleteSettings(): void {
        localStorage.removeItem(LocalStoreVarEnum.SETTINGS);
    }
}
