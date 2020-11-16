import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LogServer } from './log-server';
import { SrvHttpService } from 'app/services/http-connect/srv-http.service';
import { LogConsole, LogPublisher } from './log-publisher';
import { Injectable } from '@angular/core';
import { LogLocalStorage } from './log-local-storage';
const PUBLISHERS_FILE = '/src/app/assets/log-publishers.json';

class LogPublisherConfig {
    loggerName: string;
    loggerLocation: string;
    isActive: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class LogPublishersService {
    publishers: LogPublisher[] = [];
    constructor(private http: SrvHttpService) {
        this.buildPublishers();
    }

    getLoggers(): Observable<LogPublisherConfig[]> {
        const httpConfig = this.http.getSrvHttpConfig(PUBLISHERS_FILE,
            [],
            undefined,
            'application/json');
        return this.http.GetObs(httpConfig, true)
                .pipe(map(response => response.json()),
                catchError(this.http.handleErrors));
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
                        logPub = new LogLocalStorage();
                        break;
                    case 'webapi':
                        logPub = new LogServer(this.http);
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
