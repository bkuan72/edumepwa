import { ForgotDeliveryPasswordComponent } from 'app/main/pages/authentication/forgot-delivery-password/forgot-delivery-password.component';
import { ProfileAccessControlService } from './services/profile-access-control/profile-access-control.service';
import { UserAccountGroupCacheService } from './services/user-account-group-cache/user-account-group-cache.service';
import { SharedModule } from './pipes/shared.module';
import { MemberContactsService } from './main/apps/members/member-contacts.service';
import { ActivityService } from './services/activity/activity.service';
import { UserService } from './services/user/user.service';
import { CurrentUserLoadedGuard } from './main/guards/currentUserLoaded.guard';
import { LockComponent } from 'app/main/pages/authentication/lock/lock.component';
import { AccountLoadedGuard } from './main/guards/accountLoaded.guard';
import { AccountProfileMaintenanceFormsComponent } from './main/pages/forms/account-profile-maintenance/account-profile-maintenance-form.component';
import { AdAgeGroupService } from './services/ad-age-group/ad-age-group.service';
import { AdAgeGroupsFormComponent } from './main/pages/forms/ad-ageGroups-maintenance/ad-ageGroups-maintenance-form.component';
import { AdKeywordService } from './services/ad-keyword/ad-keyword.service';
import { AdCategoryService } from './services/ad-category/ad-category.service';
import { AdminAuthGuard } from './main/guards/adminAuth.guard';
import { AdCategoriesFormComponent } from './main/pages/forms/ad-categories-maintenance/ad-categories-maintenance-form.component';
import { UserProfileMaintenanceFormsComponent } from './main/pages/forms/user-profile-maintenance/user-profile-maintenance-forms.component';
import { AuthGuard } from './main/guards/auth.guard';
import { ProfileComponent } from './main/pages/profile/profile.component';
import { CommonComponentModule } from './components/component.module';
import { PagesModule } from './main/pages/pages.module';
import { CommonFn } from './shared/common-fn';
import { AlertService } from './services/alert/alert.service';
import { AppSettingsService } from './services/app-settings/app-settings.service';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdKeywordsFormComponent } from './main/pages/forms/ad-keywords-maintenance/ad-keywords-maintenance-form.component';
import { UserProfileSessionService } from './services/session/user-profile-session.service';
import { AngularMaterialImageOverlayModule } from 'angular-material-image-overlay';
import { ContactsService } from './main/apps/contacts/contacts.service';
import { AccountProfileComponent } from './main/pages/account-profile/account-profile.component';
import { AccountProfileService } from './main/pages/account-profile/account-profile.service';
import { MailDeviceConfirmComponent } from './main/pages/authentication/mail-device-confirm/mail-device-confirm.component';


const appRoutes: Routes = [
    {
        path        : 'lock',
        component   : LockComponent,
        canActivate : [CurrentUserLoadedGuard],
        pathMatch   : 'full'
    },
    {
        path        : 'auth/confirmMail',
        component   : MailConfirmationComponent,
        pathMatch   : 'full'
    },
    {
        path        : 'auth/confirmDeviceMail',
        component   : MailDeviceConfirmComponent,
        pathMatch   : 'full'
    },
    {
        path        : 'auth/forgot-delivery-password',
        component   : ForgotDeliveryPasswordComponent,
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
        path        : 'pages/account-profile',
        component   : AccountProfileComponent,
        canActivate : [AuthGuard],
        resolve     : {
            any: AccountProfileService
        }
    },
    {
        path        : 'maintain/profile',
        component   : UserProfileMaintenanceFormsComponent,
        canActivate : [AuthGuard]
    },
    {
        path        : 'maintain/account-profile',
        component   : AccountProfileMaintenanceFormsComponent,
        canActivate : [AuthGuard, AccountLoadedGuard]
    },
    {
        path        : 'maintain/categories',
        component   : AdCategoriesFormComponent,
        canActivate : [AdminAuthGuard],
        resolve     : {
            any: AdCategoryService
        }
    },
    {
        path        : 'maintain/keywords',
        component   : AdKeywordsFormComponent,
        canActivate : [AdminAuthGuard],
        resolve     : {
            any: AdKeywordService
        }
    },
    {
        path        : 'maintain/ageGroups',
        component   : AdAgeGroupsFormComponent,
        canActivate : [AdminAuthGuard],
        resolve     : {
            any: AdAgeGroupService
        }
    },
    {
        path        : 'contacts',
        canActivate : [AuthGuard],
        loadChildren: () => import('./main/apps/contacts/contacts.module').then(m => m.ContactsModule),
        resolve     : {
            any: ContactsService
        }
    },
    {
        path        : 'members',
        canActivate : [AuthGuard],
        loadChildren: () => import('./main/apps/members/member-contacts.module').then(m => m.MemberContactsModule),
        resolve     : {
            any: AccountProfileService
        }
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
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {
            preloadingStrategy: PreloadAllModules,
            onSameUrlNavigation: 'ignore',
            useHash: true
           }),

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
        PagesModule,
        NgbModule,
        AngularMaterialImageOverlayModule,
        SharedModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        SrvHttpService,
        AuthTokenSessionService,
        LoggerService,
        LogPublishersService,
        AppSettingsService,
        AlertService,
        UserProfileSessionService,
        ContactsService,
        MemberContactsService,
        ActivityService,
        UserService,
        CommonFn,
        UserAccountGroupCacheService,
        ProfileAccessControlService
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
