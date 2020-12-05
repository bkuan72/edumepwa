export enum DateAddIntervalEnum {
    YEAR,
    QUARTER,
    MONTH,
    WEEK,
    DAY,
    HOUR,
    MINUTE,
    SECOND,
    MILLISECOND
}

export class CommonFn {


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
        if(!(date instanceof Date)) {
            return undefined;
        }
        // don't change original date
        let ret = new Date(date); 
        const checkRollover = () => { if (ret.getDate() !== date.getDate()) {ret.setDate(0);} };
        switch(interval) {
        case DateAddIntervalEnum.YEAR   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
        case DateAddIntervalEnum.QUARTER :  ret.setMonth(ret.getMonth() + 3 * units); checkRollover();  break;
        case DateAddIntervalEnum.MONTH  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
        case DateAddIntervalEnum.WEEK   :  ret.setDate(ret.getDate() + 7 * units);  break;
        case DateAddIntervalEnum.DAY    :  ret.setDate(ret.getDate() + units);  break;
        case DateAddIntervalEnum.HOUR  :  ret.setTime(ret.getTime() + units * 3600000);  break;
        case DateAddIntervalEnum.MINUTE :  ret.setTime(ret.getTime() + units * 60000);  break;
        case DateAddIntervalEnum.SECOND :  ret.setTime(ret.getTime() + units * 1000);  break;
        case DateAddIntervalEnum.MILLISECOND :  ret.setTime(ret.getTime() + units);  break;
        default       :  ret = undefined;  break;
        }
        return ret;
    }
}
