import { AvatarModule } from 'ngx-avatar';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { MemberContactsComponent } from 'app/main/apps/members/member-contacts.component';
import { MemberContactsService } from 'app/main/apps/members/member-contacts.service';
import { MemberContactsContactListComponent } from 'app/main/apps/members/contact-list/contact-list.component';
import { MemberContactsSelectedBarComponent } from 'app/main/apps/members/selected-bar/selected-bar.component';
import { MemberContactsMainSidebarComponent } from 'app/main/apps/members/sidebars/main/main.component';
import { MemberContactsContactFormDialogComponent } from 'app/main/apps/members/contact-form/contact-form.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NgxPhotoEditorModule } from 'ngx-photo-editor';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

const routes: Routes = [
    {
        path     : '**',
        component: MemberContactsComponent,
        resolve  : {
            contacts: MemberContactsService
        }
    }
];

@NgModule({
    declarations   : [
        MemberContactsComponent,
        MemberContactsContactListComponent,
        MemberContactsSelectedBarComponent,
        MemberContactsMainSidebarComponent,
        MemberContactsContactFormDialogComponent
    ],
    imports        : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatToolbarModule,
        AvatarModule,
        PickerModule,
        NgxPhotoEditorModule,
        MatExpansionModule,
        MatSlideToggleModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatAutocompleteModule
    ],
    providers      : [
        MemberContactsService
    ],
    entryComponents: [
        MemberContactsContactFormDialogComponent
    ]
})
export class MemberContactsModule
{
}
