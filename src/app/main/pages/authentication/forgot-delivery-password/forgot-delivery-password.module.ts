import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FuseSharedModule } from '@fuse/shared.module';

import { ForgotDeliveryPasswordComponent } from 'app/main/pages/authentication/forgot-delivery-password/forgot-delivery-password.component';

const routes = [
    {
        path     : 'auth/forgot-delivery-password',
        component: ForgotDeliveryPasswordComponent
    }
];

@NgModule({
    declarations: [
        ForgotDeliveryPasswordComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        FuseSharedModule
    ]
})
export class ForgotDeliveryPasswordModule
{
}
