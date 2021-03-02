import { ProfileService } from '../../profile/profile.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';

import { FuseSharedModule } from '@fuse/shared.module';

import { AccountProfileMaintenanceFormsComponent } from './account-profile-maintenance-form.component';
import { CommonComponentModule } from 'app/components/component.module';
import { AvatarModule } from 'ngx-avatar';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NgxPhotoEditorModule } from 'ngx-photo-editor';

const routes: Routes = [
    {
        path     : 'account-profile',
        component: AccountProfileMaintenanceFormsComponent,
        resolve  : {
            any: ProfileService
        }
    }
];

@NgModule({
    declarations: [
        AccountProfileMaintenanceFormsComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        PickerModule,
        NgxPhotoEditorModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        AvatarModule,
        FuseSharedModule,
        CommonComponentModule
    ]
})
export class AccountProfileMaintenanceFormsModule
{
}
