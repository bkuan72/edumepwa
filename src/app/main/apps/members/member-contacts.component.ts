import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { MemberContactsService } from 'app/main/apps/members/member-contacts.service';
import { MemberContactsContactFormDialogComponent } from 'app/main/apps/members/contact-form/contact-form.component';
import { CommonFn } from 'app/shared/common-fn';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';

@Component({
    selector     : 'member-contacts',
    templateUrl  : './member-contacts.component.html',
    styleUrls    : ['./member-contacts.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class MemberContactsComponent implements OnInit, OnDestroy
{
    dialogRef: any;
    hasSelectedMemberContacts: boolean;
    searchInput: FormControl;
    canDev: boolean;
    panelOpenState = false;

    friendDTO: any;
    updFriendDTO: any;
    friendsSchema: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MemberContactsService} _contactsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _contactsService: MemberContactsService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,
        public fn: CommonFn,
        private _auth: AuthTokenSessionService
    )
    {
        this.canDev = this._auth.devUser;
        this.friendDTO = this._contactsService.friendDTO;
        this.updFriendDTO = this._contactsService.updFriendDTO;
        this.friendsSchema = this._contactsService.friendsSchema;

        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._contactsService.friendDTOOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((friendDTO) => {
            this.friendDTO = friendDTO;
        });
        this._contactsService.updFriendDTOOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((updFriendDTO) => {
                this.updFriendDTO = updFriendDTO;
            });
        this._contactsService.friendsSchemaOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((friendsSchema) => {
                this.friendsSchema = friendsSchema;
            });
        this._contactsService.onSelectedMemberContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedMemberContacts => {
                this.hasSelectedMemberContacts = selectedMemberContacts.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._contactsService.onSearchTextChanged.next(searchText);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Reset the search
        // this._contactsService.onSearchTextChanged.next('');

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * New contact
     */
    newContact(): void
    {
        this.dialogRef = this._matDialog.open(MemberContactsContactFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if ( !response )
                {
                    return;
                }

                this._contactsService.updateContact(response.getRawValue());
            });
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
