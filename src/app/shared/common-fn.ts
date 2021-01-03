export enum DateAddIntervalEnum {
    YEAR,
    QUARTER,
    MONTH,
    WEEK,
    DAY,
    HOUR,
    MINUTE,
    SECOND,
    MILLISECOND,
}

export class CommonFn {
    /**
     * Convert hour to milliseconds
     * @param hour - hours
     */
    hourToMillisec(hour: number): number {
        return hour * 3600000;
    }
    /**
     * Convert minutes to milliseconds
     * @param min - minutes
     */
    minToMillisec(min: number): number {
        return min * 60000;
    }
    /**
     * Convert seconds to milliseconds
     * @param sec - seconds
     */
    secToMillisec(sec: number): number {
        return sec * 1000;
    }
    /**
     * Adds time to a date. Modelled after MySQL DATE_ADD function.
     * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
     * https://stackoverflow.com/a/1214753/18511
     *
     * @param date  Date to start with
     * @param interval  One of: year, quarter, month, week, day, hour, minute, second
     * @param units  Number of units of the given interval to add.
     */
    dateAdd(date: Date, interval: DateAddIntervalEnum, units: number): Date {
        if (!(date instanceof Date)) {
            return undefined;
        }
        // don't change original date
        let ret = new Date(date);
        const checkRollover = () => {
            if (ret.getDate() !== date.getDate()) {
                ret.setDate(0);
            }
        };
        switch (interval) {
            case DateAddIntervalEnum.YEAR:
                ret.setFullYear(ret.getFullYear() + units);
                checkRollover();
                break;
            case DateAddIntervalEnum.QUARTER:
                ret.setMonth(ret.getMonth() + 3 * units);
                checkRollover();
                break;
            case DateAddIntervalEnum.MONTH:
                ret.setMonth(ret.getMonth() + units);
                checkRollover();
                break;
            case DateAddIntervalEnum.WEEK:
                ret.setDate(ret.getDate() + 7 * units);
                break;
            case DateAddIntervalEnum.DAY:
                ret.setDate(ret.getDate() + units);
                break;
            case DateAddIntervalEnum.HOUR:
                ret.setTime(ret.getTime() + this.hourToMillisec(units));
                break;
            case DateAddIntervalEnum.MINUTE:
                ret.setTime(ret.getTime() + this.minToMillisec(units));
                break;
            case DateAddIntervalEnum.SECOND:
                ret.setTime(ret.getTime() + this.secToMillisec(units));
                break;
            case DateAddIntervalEnum.MILLISECOND:
                ret.setTime(ret.getTime() + units);
                break;
            default:
                ret = undefined;
                break;
        }
        return ret;
    }

    /**
     * This function calculates the number of pages based of result set lines and lines per page
     * @param lines - result set count
     * @param linesPerPage - lines per page
     */
    getPageNo(lines: number, linesPerPage: number): number {
        let pageNo = Math.floor(lines / linesPerPage);
        if (lines % linesPerPage > 0) {
            pageNo += 1;
        }
        return pageNo;
    }

    showGenericAvatar(avatar: any): boolean {
        return avatar === undefined || avatar === null || avatar.length === 0;
    }

    /**
     * This function adds a new property to obj object
     * @param obj - target obj
     * @param fieldName - new property name
     * @param dflt - default value of property
     */
    public defineProperty(obj: any, fieldName: string, dflt: any): any {
        return Object.defineProperty(obj, fieldName, {
            value: dflt,
            writable: true,
            configurable: true,
            enumerable: true,
        });
    }
}
