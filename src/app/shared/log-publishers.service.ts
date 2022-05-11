import { HttpClient } from '@angular/common/http';
import { LogLevel } from '../services/logger/logger.service';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LogServer } from './log-server';
import { SrvHttpService } from 'app/services/http-connect/srv-http.service';
import { LogConsole, LogPublisher } from './log-publisher';
import { Injectable } from '@angular/core';
import { LogLocalStorage } from './log-local-storage';
const PUBLISHERS_FILE = 'assets/log-publishers.json';

export class LogPublisherConfig {
    loggerName: string;
    loggerLocation: string;
    logLevels: LogLevel[];
    isActive: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class LogPublishersService {
    publishers: LogPublisher[] = [];
    constructor(private _httpClient: HttpClient,
                private http: SrvHttpService) {
        this.buildPublishers();
    }

    getLoggers(): Observable<any> {
        return this._httpClient.get(
            PUBLISHERS_FILE
        );
    }

    buildPublishers = (): void => {
        let logPub: LogPublisher;

        this.getLoggers().subscribe(response => {
            for (const pub of response.filter(p => p.isActive)) {
                switch (pub.loggerName.toLowerCase()) {
                    case 'console':
                        logPub = new LogConsole();
                        break;
                    case 'localstorage':
                        logPub = new LogLocalStorage(pub);
                        break;
                    case 'webapi':
                        logPub = new LogServer(this.http, pub);
                        break;
                }

                // Set location of logging
                logPub.location = pub.loggerLocation;

                // Add publisher to array
                this.publishers.push(logPub);
            }
        });
    }
}
