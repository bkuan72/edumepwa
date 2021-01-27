import { UserProfileMaintenanceFormsComponent } from './main/pages/forms/user-profile-maintenance/user-profile-maintenance-forms.component';
import { AuthGuard } from './main/guards/auth.guard';
import { ProfileComponent } from './main/pages/profile/profile.component';
import { SessionService } from './services/session/session.service';
import { CommonComponentModule } from './components/component.module';
import { PagesModule } from './main/pages/pages.module';
import { CommonFn } from './shared/common-fn';
import { AlertService } from './services/alert/alert.service';
import { AppSettingsService } from './services/app-settings/app-settings.service';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SrvHttpService } from 'app/services/http-connect/srv-http.service';
import { LogPublishersService } from './shared/log-publishers.service';
import { LoggerService } from './services/logger/logger.service';
import { AvatarModule } from 'ngx-avatar';
import { MailConfirmationComponent } from './main/pages/authentication/mail-confirmation/mail-confirmation.component';
import { ResetPasswordComponent } from './main/pages/authentication/reset-password/reset-password.component';
import { AuthTokenSessionService } from './services/auth-token-session/auth-token-session.service';
import { ProfileService } from './main/pages/profile/profile.service';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

const appRoutes: Routes = [
    {
        path        : 'auth/confirmMail',
        component   : MailConfirmationComponent,
        pathMatch   : 'full'
    },
    {
        path        : 'auth/resetPassword',
        component   : ResetPasswordComponent,
        pathMatch   : 'full'
    },
    {
        path        : 'pages/profile',
        component   : ProfileComponent,
        canActivate : [AuthGuard],
        resolve     : {
            any: ProfileService
        }
    },
    {
        path        : 'pages/forms/user-profile-maintenance-forms',
        component   : UserProfileMaintenanceFormsComponent,
        canActivate : [AuthGuard]
    },
    {
        path        : 'pages',
        loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
    },
    {
        path        : '**',
        redirectTo  :  'search/modern'
    },

];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        CommonComponentModule,
        AvatarModule,
        PickerModule,

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        PagesModule
    ],
    providers: [
        SrvHttpService,
        AuthTokenSessionService,
        LoggerService,
        LogPublishersService,
        AppSettingsService,
        AlertService,
        SessionService,
        CommonFn
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
