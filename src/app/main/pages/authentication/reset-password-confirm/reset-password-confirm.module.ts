import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { FuseSharedModule } from '@fuse/shared.module';

import { ResetPasswordConfirmComponent } from 'app/main/pages/authentication/reset-password-confirm/reset-password-confirm.component';

const routes = [
    {
        path     : 'auth/reset-password-confirm',
        component: ResetPasswordConfirmComponent
    }
];

@NgModule({
    declarations: [
        ResetPasswordConfirmComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatIconModule,

        FuseSharedModule
    ]
})
export class ResetPasswordConfirmModule
{
}
