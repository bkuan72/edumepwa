import { AdAgeGroupsFormComponent } from './ad-ageGroups-maintenance-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';

import { FuseSharedModule } from '@fuse/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonComponentModule } from 'app/components/component.module';
import { AdAgeGroupService } from 'app/services/ad-age-group/ad-age-group.service';


const routes: Routes = [
    {
        path     : 'ageGroups',
        component: AdAgeGroupsFormComponent,
        resolve  : {
            any: AdAgeGroupService
        }
    }
];

@NgModule({
    declarations: [
        AdAgeGroupsFormComponent
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
        NgxDatatableModule,
        CommonComponentModule
    ]
})
export class AdAgeGroupsFormModule
{
}
