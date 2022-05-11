import { LogEntry } from '../services/logger/logger.service';
import { Observable, of } from 'rxjs';



export abstract class LogPublisher {
    location: string;
    abstract log(record: LogEntry):
    Observable<boolean>;
    abstract clear(): Observable<boolean>;
}

export class LogConsole extends LogPublisher {
    log = (entry: LogEntry): Observable<boolean> => {
        // Log to console
        console.log(entry.buildLogString());
        return of(true);
    }

    clear = (): Observable<boolean> => {
        console.clear();
        return of(true);
    }
}
