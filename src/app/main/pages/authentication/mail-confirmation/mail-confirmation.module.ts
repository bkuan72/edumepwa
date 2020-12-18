import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { FuseSharedModule } from '@fuse/shared.module';

import { MailConfirmationComponent } from 'app/main/pages/authentication/mail-confirmation/mail-confirmation.component';

const routes = [
    {
        path     : 'auth/mail-confirmation',
        component: MailConfirmationComponent
    }
];

@NgModule({
    declarations: [
        MailConfirmationComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatIconModule,

        FuseSharedModule
    ]
})
export class MailConfirmationModule
{
}
