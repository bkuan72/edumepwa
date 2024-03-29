import { AbstractControl, FormGroup } from '@angular/forms';
import { isString } from 'lodash';
import { isMoment, Moment } from 'moment';
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
        let addMillisec = 0;
        let daysFraction = 0;
        let adjDays = 0;
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
                    daysFraction = units / 24;
                    addMillisec = units * 3600000;
                    if (daysFraction >= 1.0) {
                      adjDays = parseInt(daysFraction.toFixed(0), 0);
                      ret.setDate(ret.getDate() + adjDays);
                      addMillisec -= (adjDays * (8640000));
                    }
      
                    ret.setTime(ret.getTime() + addMillisec);
                    break;
                case DateAddIntervalEnum.MINUTE:
                    daysFraction = units / 1440;
                    addMillisec = units * 60000;
                    if (daysFraction >= 1.0) {
                      adjDays = parseInt(daysFraction.toFixed(0), 0);
                      ret.setDate(ret.getDate() + adjDays);
                      addMillisec -= (adjDays * (8640000));
                    }
                    ret.setTime(ret.getTime() + addMillisec);
                    break;
                case DateAddIntervalEnum.SECOND:
                    daysFraction = units / 86400;
                    addMillisec = units * 1000;
                    if (daysFraction >= 1.0) {
                      adjDays = parseInt(daysFraction.toFixed(0), 0);
                      ret.setDate(ret.getDate() + adjDays);
                      addMillisec -= (adjDays * (8640000));
                    }
                    ret.setTime(ret.getTime() + addMillisec);
                    break;
                case DateAddIntervalEnum.MILLISECOND:
                    daysFraction = units / 86400000;
                    addMillisec = units;
                    if (daysFraction >= 1.0) {
                      adjDays = parseInt(daysFraction.toFixed(0), 0);
                      ret.setDate(ret.getDate() + adjDays);
                      addMillisec -= (adjDays * (8640000));
                    }
                    ret.setTime(ret.getTime() + addMillisec);
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
        return (
            avatar === undefined ||
            avatar === null ||
            avatar.length === 0 ||
            avatar === ''
        );
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
     * This function map value from obj2 to obj1 if property exist in obj1
     * @param obj1 - object to map data to
     * @param obj2 - object to data
     */
    public mapValueToObj = (obj1: any, obj2: any, excludeProp?: string[]): any => {
        // tslint:disable-next-line:forin
        for (const propName in obj1) {
            let incProp = true;
            if (excludeProp) {
                excludeProp.some((exPropName) => {
                    if (exPropName === propName) {
                        incProp = false;
                        return true;
                    }
                });
            }
            if (incProp && this.hasProperty(obj2, propName)) {
                obj1[propName] = obj2[propName];
            }
        }
        return obj1;
    }

    /**
     * This function create a new object that has properties that obj1 and obj2 has matching
     * and copy obj2 data to new object
     * @param obj1 - object to map data to
     * @param obj2 - object to data
     */
    public mapObj = (obj1: any, obj2: any, excludeProp?: string[]): any => {
        let mapObj = {};
        // tslint:disable-next-line:forin
        for (const propName in obj1) {
            let incProp = true;
            if (excludeProp) {
                excludeProp.some((exPropName) => {
                    if (exPropName === propName) {
                        incProp = false;
                        return true;
                    }
                });
            }
            if (incProp && this.hasProperty(obj2, propName)) {
                if (isMoment(obj2[propName])) {
                    const momentObj: Moment = obj2[propName];
                    const dateObj = momentObj.toDate();
                    mapObj = this.defineProperty(mapObj, propName, dateObj.toISOString());
                } else {
                    mapObj = this.defineProperty(mapObj, propName, obj2[propName]);
                }
            }
        }
        return mapObj;
    }

    /**
     * This function maps obj1 property values to Form controls has matching
     * and copy obj2 data to new object
     * @param obj1 - object to map data to
     * @param form - form group
     */
    public mapObjValueToForm = (obj1: any, form: FormGroup): any => {
        for (const propName in obj1) {
            if (this.hasProperty(form.controls, propName)) {
                form.controls[propName].setValue(obj1[propName]);
            }
        }
    }

    /**
     * This function create a new object that has properties that obj1 and obj2 has matching
     * and copy obj2 data to new object if the two property value does not match
     * @param obj1 - object to map data to
     * @param obj2 - object to data
     */
    public mapObjChangedPropertyValue = (
        obj1: any,
        obj2: any,
        excludeProp?: string[]
    ): any | undefined => {
        let mapObj;
        // tslint:disable-next-line:forin
        for (const propName in obj1) {
            let checkProp = true;
            if (excludeProp) {
                excludeProp.some((exPropName) => {
                    if (exPropName === propName) {
                        checkProp = false;
                        return true;
                    }
                });
            }
            if (checkProp && this.hasProperty(obj2, propName)) {
                if (obj1[propName] !== obj2[propName]) {
                    if (mapObj === undefined) {
                        mapObj = {};
                    }
                    mapObj = this.defineProperty(
                        mapObj,
                        propName,
                        obj2[propName]
                    );
                }
            }
        }
        return mapObj;
    }

    /**
     * This function create a new object that has properties that formCtrl and obj2 has matching
     * and copy obj2 data to new object if the two property value does not match
     * @param formCtrl - object to map data to
     * @param obj2 - object to data
     */
    public mapFormControlChangedPropertyValue = (
        formCtrl: {
            [key: string]: AbstractControl;
        },
        obj2: any
    ): any | undefined => {
        let mapObj;
        for (const propName in formCtrl) {
            if (this.hasProperty(obj2, propName)) {
                if (formCtrl[propName].value !== obj2[propName]) {
                    if (mapObj === undefined) {
                        mapObj = {};
                    }
                    mapObj = this.defineProperty(
                        mapObj,
                        propName,
                        formCtrl[propName].value
                    );
                }
            }
        }
        return mapObj;
    }

    /**
     * This function compress the image
     * @param base64Src - image data
     * @param newX  - new width in px
     * @param newY  - new height in px
     */
    private compressImage(
        base64Src: string,
        newX: number,
        newY: number
    ): Promise<string> {
        return new Promise((res, rej) => {
            const img = new Image();
            img.src = base64Src;

            img.onload = () => {
                const elem = document.createElement('canvas');
                elem.width = newX;
                elem.height = newY;
                const ctx = elem.getContext('2d');

                ctx.drawImage(img, 0, 0, newX, newY);
                const data = ctx.canvas.toDataURL();
                res(data);
            };
            img.onerror = (error) => rej('Failed To Compress Image');
        });
    }

    /**
     * This function resize an image to a standard avatar image that is H128 px * W128 px
     * @param base64Src - image data
     */
    public toAvatarDataURL(base64Src: string): Promise<string> {
        return this.compressImage(base64Src, 128, 128);
    }

    /**
     * This function resize image
     * @param base64Src - source data for image
     * @param resizePercent - resize to percentage of original image size
     * @param minPixel - minimum pixel length
     */
    public resizeImage(
        base64Src: string,
        maxPixel: number,
        minPixel: number
    ): Promise<string> {
        return new Promise((res, rej) => {
            const img = new Image();
            img.src = base64Src;

            img.onload = () => {
                let newX;
                let newY;
                let aspectRatio;
                if (img.width > img.height) {
                    aspectRatio = img.height / img.width;
                    newX = maxPixel;
                    newY = newX * aspectRatio;
                } else {
                    if (img.width < img.height) {
                        aspectRatio = img.width / img.height;
                        newY = maxPixel;
                        newX = newY * aspectRatio;
                    } else {
                        newX = minPixel;
                        newY = minPixel;
                    }
                }

                const elem = document.createElement('canvas');
                elem.width = newX;
                elem.height = newY;
                const ctx = elem.getContext('2d');
                ctx.drawImage(img, 0, 0, newX, newY);
                const data = ctx.canvas.toDataURL();
                res(data);
            };
            img.onerror = (error) => rej(error);
        });
    }

    /**
     * Return true if string is empty
     * @param val - string
     * @returns boolean
     */
    emptyStr(val: string): boolean {
        let empty = false;
        if (val === undefined) {
            empty = true;
        } else {
            if (val === null) {
                empty = true;
            } else {
                if (isString(val)) {
                    if (val.trim().length === 0) {
                        empty = true;
                    }
                } else {
                    empty = true;
                }
            }
        }
        return empty;
    }

    /**
     * get Today's ISO string date
     *
     * @returns todays ISO string date
     */
    getNowISODate(): string {
        const now = new Date();
        return now.toISOString();
    }

    /**
     * check if uuid is ZERO value
     * @param uuid
     * @returns true/false
     */
    isZeroUuid(uuid: string): boolean {
        let zeroUuid = false;
        zeroUuid = uuid === '30000000-0000-0000-0000-000000000000';
        if (this.emptyStr(uuid)) {
            zeroUuid = true;
        } else {
            if (uuid === '00000000-0000-0000-0000-000000000000') {
                zeroUuid = true;
            }
        }
        return zeroUuid;
    }
}
