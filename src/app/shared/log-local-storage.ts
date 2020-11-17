import { isUndefined } from 'lodash';
import { LogPublisher } from './log-publisher';
import { Observable, of } from 'rxjs';
import { LogEntry } from 'app/services/logger/logger.service';
import { LogPublisherConfig } from './log-publishers.service';


export class LogLocalStorage extends LogPublisher {
    constructor(
        private logConfig: LogPublisherConfig
    ) {
        // Must call `super()`from derived classes
        super();

        // Set location
        this.location = 'logging';
    }

    // Append log entry to local storage
    log(entry: LogEntry): Observable<boolean> {
        let ret = false;
        let values: LogEntry[];
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
            try {
                // Get previous values from local storage
                values = JSON.parse(localStorage.getItem(this.location)) || [];

                // Add new log entry to array
                values.push(entry);

                // Store array into local storage
                localStorage.setItem(this.location, JSON.stringify(values));

                // Set return value
                ret = true;
            } catch (ex) {
                // Display error in console
                console.log(ex);
            }
        }

        return of(ret);
    }

    // Clear all log entries from local storage
    clear(): Observable<boolean> {
        localStorage.removeItem(this.location);
        return of(true);
    }
}
