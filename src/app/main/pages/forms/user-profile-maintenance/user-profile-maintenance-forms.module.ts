import { ProfileService } from './../../profile/profile.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';

import { FuseSharedModule } from '@fuse/shared.module';

import { UserProfileMaintenanceFormsComponent } from './user-profile-maintenance-forms.component';
import { CommonComponentModule } from 'app/components/component.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';


const routes: Routes = [
    {
        path     : 'profile',
        component: UserProfileMaintenanceFormsComponent,
        resolve  : {
            any: ProfileService
        }
    }
];

@NgModule({
    declarations: [
        UserProfileMaintenanceFormsComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatSlideToggleModule,
        MatTabsModule,
        MatExpansionModule,
        FuseSharedModule,
        CommonComponentModule
    ]
})
export class UserProfileMaintenanceFormsModule
{
}
