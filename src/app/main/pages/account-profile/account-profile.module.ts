import { GroupsComponent } from './tabs/group/group.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonComponentModule } from '../../../components/component.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { AccountTimelineService } from './account-timeline.service';
import { AvatarModule } from 'ngx-avatar';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FuseSharedModule } from '@fuse/shared.module';

import { ProfileTimelineComponent } from 'app/main/pages/account-profile/tabs/timeline/timeline.component';
import { ProfileAboutComponent } from 'app/main/pages/account-profile/tabs/about/about.component';
import { ProfilePhotosVideosComponent } from 'app/main/pages/account-profile/tabs/photos-videos/photos-videos.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import {NgxPhotoEditorModule} from 'ngx-photo-editor';
import { AccountsService } from 'app/services/account/account.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import {MatBadgeModule} from '@angular/material/badge';
import { AccountProfileComponent } from './account-profile.component';
import { AccountProfileService } from './account-profile.service';


const routes = [
    {
        path     : 'account-profile',
        component: AccountProfileComponent,
        resolve  : {
            profile: AccountProfileService
        }
    }
];

@NgModule({
    declarations: [
        AccountProfileComponent,
        ProfileTimelineComponent,
        ProfileAboutComponent,
        ProfilePhotosVideosComponent,
        GroupsComponent,
        ],
    imports     : [
        RouterModule.forChild(routes),
        PickerModule,
        NgxPhotoEditorModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatTabsModule,
        AvatarModule,
        MatMomentDateModule,
        MatExpansionModule,
        MatBadgeModule,

        FuseSharedModule,
        CommonComponentModule
    ],
    providers   : [
        AccountProfileService,
        AccountTimelineService,
        AccountsService
    ]
})
export class AccountProfileModule
{
}
