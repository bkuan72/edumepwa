import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { FuseSharedModule } from '@fuse/shared.module';

import { MailDeviceConfirmComponent } from 'app/main/pages/authentication/mail-device-confirm/mail-device-confirm.component';

const routes = [
    {
        path     : 'auth/mail-device-confirm',
        component: MailDeviceConfirmComponent
    }
];

@NgModule({
    declarations: [
        MailDeviceConfirmComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatIconModule,

        FuseSharedModule
    ]
})
export class MailDeviceConfirmModule
{
}
