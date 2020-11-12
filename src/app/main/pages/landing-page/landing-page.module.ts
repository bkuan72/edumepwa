import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

import { FuseSharedModule } from '@fuse/shared.module';

import { LandingPageComponent } from './landing-page.component';
import { LandingPageService } from './landing-page.service';


const routes = [
    {
        path     : 'landing-page',
        component: LandingPageComponent,
        resolve  : {
            search: LandingPageService
        }
    }
];

@NgModule({
    declarations: [
        LandingPageComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatTabsModule,

        FuseSharedModule
    ],
    providers   : [
        LandingPageService
    ]
})
export class LandingPageModule
{
}
