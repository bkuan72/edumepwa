import { SrvApiEnvEnum } from './SrvApiEnvEnum';
import { isUndefined } from 'lodash';
import { catchError, map } from 'rxjs/operators';
import { SrvHttpService } from './../services/http-connect/srv-http.service';
import { Observable, of, throwError } from 'rxjs';
import { LogEntry } from '../services/logger/logger.service';
import { LogPublisher } from './log-publisher';
import { LogPublisherConfig } from './log-publishers.service';

export class LogServer extends LogPublisher {
    constructor(
        private http: SrvHttpService,
        private logConfig: LogPublisherConfig
        ) {
        // Must call `super()`from derived classes
        super();
    }

    // Clear all log entries from local storage
    clear(): Observable<boolean> {
        // TODO: Call Web API to clear all values
        return of(true);
    }
    // Add log entry to back end data store
    log = (entry: LogEntry): Observable<boolean> => {
        let sendLog = false;
        if (isUndefined(this.logConfig) || this.logConfig.logLevels.length === 0) {
            sendLog = true;
        } else {
            this.logConfig.logLevels.some((level) => {
                if (level === entry.level) {
                    sendLog = true;
                    return true;
                }
            });
        }

        if (sendLog) {
            const httpConfig = this.http.getSrvHttpConfig(SrvApiEnvEnum.log,
                undefined,
                entry,
                'application/json',
                false);
            return this.http.PostObs(httpConfig, true)
            .pipe(map(response => response.json()),
            catchError(this.http.handleObsErrors));
        } else {
            return of(true);
        }
    }


}
