import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { MemberContactsService } from 'app/main/apps/members/member-contacts.service';

@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class MemberContactsSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedMemberContacts: boolean;
    isIndeterminate: boolean;
    selectedMemberContacts: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MemberContactsService} _contactsService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _contactsService: MemberContactsService,
        public _matDialog: MatDialog
    )
    {
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
        this._contactsService.onSelectedMemberContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedMemberContacts => {
                this.selectedMemberContacts = selectedMemberContacts;
                setTimeout(() => {
                    this.hasSelectedMemberContacts = selectedMemberContacts.length > 0;
                    this.isIndeterminate = (selectedMemberContacts.length !== this._contactsService.contacts.length && selectedMemberContacts.length > 0);
                }, 0);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Select all
     */
    selectAll(): void
    {
        this._contactsService.selectMemberContacts();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._contactsService.deselectMemberContacts();
    }

    /**
     * Delete selected contacts
     */
    deleteSelectedMemberContacts(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected contacts?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._contactsService.deleteSelectedMemberContacts();
                }
                this.confirmDialogRef = null;
            });
    }
}
