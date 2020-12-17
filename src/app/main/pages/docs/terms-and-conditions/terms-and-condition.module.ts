import { MatListModule } from '@angular/material/list';
import { FuseSidebarModule } from './../../../../../@fuse/components/sidebar/sidebar.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FuseSharedModule } from '@fuse/shared.module';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';
import { FuseDemoSidebarComponent } from './demo-sidebar/demo-sidebar.component';
import { FuseDemoContentComponent } from './demo-content/demo-content.component';

const routes = [
    {
        path     : 'docs/terms-and-conditions',
        component: TermsAndConditionsComponent
    }
];

@NgModule({
    declarations: [
        TermsAndConditionsComponent,
        FuseDemoSidebarComponent,
        FuseDemoContentComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,

        FuseSharedModule,
        FuseSidebarModule
    ]
})
export class TermsAndConditionsModule
{
}
