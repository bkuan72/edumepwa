import { DateSinceNowPipe } from './../../../pipes/date-since-now.pipe';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TimelineService } from './timeline.service';
import { AvatarModule } from 'ngx-avatar';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FuseSharedModule } from '@fuse/shared.module';

import { ProfileService } from 'app/main/pages/profile/profile.service';
import { ProfileComponent } from 'app/main/pages/profile/profile.component';
import { ProfileTimelineComponent } from 'app/main/pages/profile/tabs/timeline/timeline.component';
import { ProfileAboutComponent } from 'app/main/pages/profile/tabs/about/about.component';
import { ProfilePhotosVideosComponent } from 'app/main/pages/profile/tabs/photos-videos/photos-videos.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import {NgxPhotoEditorModule} from 'ngx-photo-editor';
import { AccountsComponent } from 'app/main/pages/profile/tabs/account/account.component';
import { AccountsService } from 'app/services/account/account.service';



const routes = [
    {
        path     : 'profile',
        component: ProfileComponent,
        resolve  : {
            profile: ProfileService
        }
    }
];

@NgModule({
    declarations: [
        ProfileComponent,
        ProfileTimelineComponent,
        ProfileAboutComponent,
        ProfilePhotosVideosComponent,
        DateSinceNowPipe,
        AccountsComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        PickerModule,
        NgxPhotoEditorModule,
        MatProgressSpinnerModule,

        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatTabsModule,
        AvatarModule,
        MatMomentDateModule,

        FuseSharedModule
    ],
    providers   : [
        ProfileService,
        TimelineService,
        AccountsService
    ]
})
export class ProfileModule
{
}
