import { UserProfileMaintenanceFormsModule } from './forms/user-profile-maintenance/user-profile-maintenance-forms.module';
import { MaintenanceModule } from './errors/maintenance/maintenance.module';
import { ResetPasswordConfirmModule } from './authentication/reset-password-confirm/reset-password-confirm.module';
import { MailConfirmationModule } from './authentication/mail-confirmation/mail-confirmation.module';
import { TermsAndConditionsModule } from './docs/terms-and-conditions/terms-and-condition.module';
import { SearchModernModule } from './search/modern/search-modern.module';
import { ProfileModule } from './profile/profile.module';
import { ComingSoonModule } from './coming-soon/coming-soon.module';
import { MailConfirmModule } from './authentication/mail-confirm/mail-confirm.module';
import { LockModule } from './authentication/lock/lock.module';
import { ForgotPasswordModule } from './authentication/forgot-password/forgot-password.module';
import { Error500Module } from './errors/500/error-500.module';
import { Error404Module } from './errors/404/error-404.module';
import { ResetPasswordModule } from './authentication/reset-password/reset-password.module';
import { RegisterModule } from './authentication/register/register.module';
import { LoginModule } from './authentication/login/login.module';
import { NgModule } from '@angular/core';



@NgModule({
    imports: [
        // Authentication
        LoginModule,
        // Login2Module,
        RegisterModule,
        // Register2Module,
        ForgotPasswordModule,
        // ForgotPassword2Module,
        ResetPasswordModule,
        ResetPasswordConfirmModule,
        // ResetPassword2Module,
        LockModule,
        MailConfirmModule,
        MailConfirmationModule,

        // Coming-soon
        ComingSoonModule,

        // Errors
        Error404Module,
        Error500Module,

        // Invoices
        // InvoiceModernModule,
        // InvoiceCompactModule,

        // Maintenance
        MaintenanceModule,

        // Pricing
        // PricingModule,

        // Profile
        ProfileModule,

        // Search
        // SearchClassicModule,
        SearchModernModule,

        // Faq
        // FaqModule,

        // Knowledge base
        // KnowledgeBaseModule
        TermsAndConditionsModule,

        // User Profile Maintenance form
        UserProfileMaintenanceFormsModule
    ]
})
export class PagesModule
{

}
