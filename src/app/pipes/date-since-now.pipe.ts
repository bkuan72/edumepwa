import { Pipe, PipeTransform } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';

@Pipe({
  name: 'dateSinceNow'
})
export class DateSinceNowPipe implements PipeTransform {

  transform(dateValue: any, args?: any): any {
    const dateVal = new Date(dateValue);
    const now = new Date();
    if (dateVal.getDate() > (now.getDate() - 7)) {

        return moment(dateValue).fromNow();
    }
    return moment(dateVal).format('LLL');
  }

}
