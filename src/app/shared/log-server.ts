import { catchError, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { SrvHttpService } from './../services/http-connect/srv-http.service';
import { Observable, of, throwError } from 'rxjs';
import { LogEntry } from '../services/logger/logger.service';
import { LogPublisher } from './log-publisher';

export class LogServer extends LogPublisher {
    constructor(
        private http: SrvHttpService
        ) {
        // Must call `super()`from derived classes
        super();

        // Set location
        this.location = '/api/log';
    }

    // Clear all log entries from local storage
    clear(): Observable<boolean> {
        // TODO: Call Web API to clear all values
        return of(true);
    }
    // Add log entry to back end data store
    log = (entry: LogEntry): Observable<boolean> => {
        const httpConfig = this.http.getSrvHttpConfig(this.location,
                                                        [],
                                                        entry,
                                                        'application/json');
        return this.http.PostObs(httpConfig, true)
        .pipe(map(response => response.json()),
                catchError(this.http.handleErrors));
    }


}
