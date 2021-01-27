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

    /**
     * this function determine if a avatar has been defined
     * @param avatar - ling to avatar file
     */
    showGenericAvatar(avatar: string): boolean {
        return avatar === undefined || avatar === null || avatar.length === 0 || avatar === '';
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

    /**
     * This function check if object has property name defined
     * @param obj - object
     * @param prop - property name
     */
    public hasProperty = (obj: any, prop: string): boolean => {
        let found = false;
        for (const key in obj) {
          if (key === prop) {
            found = true;
          }
        }
        return found;
    }

    /**
     * This function create a new object that has properties that obj1 and obj2 has matching
     * and copy obj2 data to new object
     * @param obj1 - object to map data to
     * @param obj2 - object to data
     */
    public mapObj = (obj1: any, obj2: any): any => {
        let mapObj = {};
        for (const propName in obj1) {
            if (this.hasProperty(obj2, propName)) {
                mapObj = this.defineProperty(mapObj, propName, obj2[propName]);
            }
        }
        return mapObj;
    }

    /**
     * This function create a new object that has properties that obj1 and obj2 has matching
     * and copy obj2 data to new object if the two property value does not match
     * @param obj1 - object to map data to
     * @param obj2 - object to data
     */
    public mapObjChangedPropertyValue = (obj1: any, obj2: any): any | undefined => {
        let mapObj;
        for (const propName in obj1) {
            if (this.hasProperty(obj2, propName)) {
                if (obj1[propName] !== obj2[propName]) {
                    if (mapObj === undefined) {
                        mapObj = {};
                    }
                    mapObj = this.defineProperty(mapObj, propName, obj1[propName].value);
                }
            }
        }
        return mapObj;
    }
}
