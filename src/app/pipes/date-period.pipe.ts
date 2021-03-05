import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'date-period'
})
export class DatePeriodPipe implements PipeTransform {

    transform(dateValue: any, args?: any): any {
        const dateVal = new Date(dateValue);
        const now = new Date();
        if (dateVal.getDate() > (now.getDate() - 7)) {

            return moment(dateValue).fromNow();
        }
        return moment(dateVal).format('MMMM YYYY');
      }

}
