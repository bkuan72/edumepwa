import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { MemberContactsService } from 'app/main/apps/members/member-contacts.service';
import { MemberContactsContactFormDialogComponent } from 'app/main/apps/members/contact-form/contact-form.component';
import { CommonFn } from 'app/shared/common-fn';
import { OkDialogComponent } from 'app/components/ok-dialog/ok-dialog.component';
import { UserProfileSessionService } from 'app/services/session/user-profile-session.service';

@Component({
    selector     : 'contacts-contact-list',
    templateUrl  : './contact-list.component.html',
    styleUrls    : ['./contact-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class MemberContactsContactListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    contacts: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'avatar', 'first_name', 'email', 'mobile_no', 'job_title', 'buttons'];
    selectedMemberContacts: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    okDialogRef: MatDialogRef<OkDialogComponent>;

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
        public _matDialog: MatDialog,
        public fn: CommonFn,
        private _session: UserProfileSessionService
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
        this.dataSource = new FilesDataSource(this._contactsService);

        this._contactsService.onMemberContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(contacts => {
                this.contacts = contacts;

                this.checkboxes = {};
                contacts.map(contact => {
                    this.checkboxes[contact.id] = false;
                });
            });

        this._contactsService.onSelectedMemberContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedMemberContacts => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedMemberContacts.includes(id);
                }
                this.selectedMemberContacts = selectedMemberContacts;
            });

        this._contactsService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._contactsService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._contactsService.deselectMemberContacts();
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
     * Edit contact
     *
     * @param contact
     */
    editContact(contact): void
    {
        this.dialogRef = this._matDialog.open(MemberContactsContactFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                contact: contact,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':

                        this._contactsService.updateContact(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteContact(contact);

                        break;
                }
            });
    }

    /**
     * Delete Contact
     */
    deleteContact(contact): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._contactsService.deleteContact(contact.id);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param contactId
     */
    onSelectedChange(contactId): void
    {
        this._contactsService.toggleSelectedContact(contactId);
    }

    /**
     * Toggle star
     *
     * @param contact
     */
    toggleStar(contact: any): void
    {
        if (contact.blockUser) {
            return;
        }
        this._contactsService.updateContactStar(contact.id);
    }

    gotoProfile(friend): void {
        if (this.fn.isZeroUuid(friend.friend_id)) {
            this.okDialogRef = this._matDialog.open(OkDialogComponent, {
                disableClose: false
            });
            this.okDialogRef.componentInstance.confirmMessage = 'Friend is NOT a Registered User';
            this.okDialogRef.afterClosed().subscribe(result => {

                this.okDialogRef = null;
            });
        } else {
            this._contactsService.checkBlockByFriend(friend.friend_id).then((resp) => {
                if (resp.blocked) {
                    this.okDialogRef = this._matDialog.open(OkDialogComponent, {
                        disableClose: false
                    });
                    this.okDialogRef.componentInstance.confirmMessage = 'You have been blocked by User';
                    this.okDialogRef.afterClosed().subscribe(result => {
        
                        this.okDialogRef = null;
                    });
                } else {
                    this._session.goToUserProfile(friend.friend_id);
                }
            })
            .catch(() => {
                this.okDialogRef = this._matDialog.open(OkDialogComponent, {
                    disableClose: false
                });
                this.okDialogRef.componentInstance.confirmMessage = 'Unable to goto Profile';
                this.okDialogRef.afterClosed().subscribe(result => {
    
                    this.okDialogRef = null;
                });
            });
        }

    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {MemberContactsService} _contactsService
     */
    constructor(
        private _contactsService: MemberContactsService
    )
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._contactsService.onMemberContactsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
