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

const routes: Routes = [
    {
        path     : 'maintain/profile',
        component: UserProfileMaintenanceFormsComponent
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

        FuseSharedModule,
        CommonComponentModule
    ]
})
export class UserProfileMaintenanceFormsModule
{
}
