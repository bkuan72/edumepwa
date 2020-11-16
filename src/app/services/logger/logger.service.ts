import { LogPublisher } from '../../shared/log-publisher';

import { LogPublishersService } from '../../shared/log-publishers.service';
import { Injectable } from '@angular/core';

export enum LogLevel {
    All = 0,
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
    Fatal = 5,
    Off = 6,
}

export class LogEntry {
    // Public Properties
    entryDate: Date = new Date();
    message = '';
    level: LogLevel = LogLevel.Debug;
    extraInfo: any[] = [];
    logWithDate = true;

    buildLogString(): string {
        let ret = '';

        if (this.logWithDate) {
            ret = new Date() + ' - ';
        }

        ret += 'Type: ' + LogLevel[this.level];
        ret += ' - Message: ' + this.message;
        if (this.extraInfo.length) {
            ret += ' - Extra Info: ' + this.formatParams(this.extraInfo);
        }

        return ret;
    }

    private formatParams(params: any[]): string {
        let ret: string = params.join(',');

        // Is there at least one object in the array?
        if (params.some((p) => typeof p === 'object')) {
            ret = '';

            // Build comma-delimited string
            for (const item of params) {
                ret += JSON.stringify(item) + ',';
            }
        }

        return ret;
    }
}

@Injectable({
    providedIn: 'root',
})
export class LoggerService {
    level: LogLevel;
    logWithDate: boolean;
    publishers: LogPublisher[];
    constructor(
        private publishersService: LogPublishersService
    ) {
        this.level = LogLevel.All;
        this.logWithDate = true;
        this.publishers = this.publishersService.publishers;
    }

    private shouldLog(level: LogLevel): boolean {
        let ret = false;
        if (
            (level >= this.level && level !== LogLevel.Off) ||
            this.level === LogLevel.All
        ) {
            ret = true;
        }
        return ret;
    }

    private writeToLog(msg: string, level: LogLevel, params: any[]): void {
        if (this.shouldLog(level)) {
            const entry: LogEntry = new LogEntry();
            entry.message = msg;
            entry.level = level;
            entry.extraInfo = params;
            entry.logWithDate = this.logWithDate;
            for (const logger of this.publishers) {
                logger.log(entry).subscribe(response => console.log(response));
            }
        }
    }

    debug(msg: string, ...optionalParams: any[]): void {
        this.writeToLog(msg, LogLevel.Debug, optionalParams);
    }

    info(msg: string, ...optionalParams: any[]): void {
        this.writeToLog(msg, LogLevel.Info, optionalParams);
    }

    warn(msg: string, ...optionalParams: any[]): void {
        this.writeToLog(msg, LogLevel.Warn, optionalParams);
    }

    error(msg: string, ...optionalParams: any[]): void {
        this.writeToLog(msg, LogLevel.Error, optionalParams);
    }

    fatal(msg: string, ...optionalParams: any[]): void {
        this.writeToLog(msg, LogLevel.Fatal, optionalParams);
    }

    log(msg: string, ...optionalParams: any[]): void {
        this.writeToLog(msg, LogLevel.All, optionalParams);
    }
}
