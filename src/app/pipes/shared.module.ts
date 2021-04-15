import { DatePeriodPipe } from './date-period.pipe';
import { DateSinceNowPipe } from './date-since-now.pipe';
import { NgModule } from '@angular/core';
@NgModule({
    imports: [],
    declarations: [ DateSinceNowPipe,
    DatePeriodPipe ],
    exports: [ DateSinceNowPipe,
    DatePeriodPipe ]
  })
  export class SharedModule { }
