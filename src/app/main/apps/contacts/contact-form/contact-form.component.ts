import { CommonFn } from 'app/shared/common-fn';
import { UserService } from './../../../../services/user/user.service';
import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

import { Contact } from 'app/main/apps/contacts/contact.model';
import { Observable, Subject } from 'rxjs';
import { startWith, map, takeUntil, debounceTime } from 'rxjs/operators';
import { AuthTokenSessionService } from 'app/services/auth-token-session/auth-token-session.service';
import { ContactsService } from '../contacts.service';
import { OkDialogComponent } from 'app/components/ok-dialog/ok-dialog.component';

@Component({
    selector     : 'contacts-contact-form-dialog',
    templateUrl  : './contact-form.component.html',
    styleUrls    : ['./contact-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ContactsContactFormDialogComponent implements OnDestroy, OnInit
{
    selectedUser: any;
    action: string;
    contact: Contact;
    contactForm: FormGroup;
    dialogTitle: string;
    newContact = true;

    filteredUsers: any[];
    searchCtrl = new FormControl();

    // Private
    private _unsubscribeAll: Subject<any>;
    confirmDialogRef: MatDialogRef<OkDialogComponent>;

    /**
     * Constructor
     *
     * @param {MatDialogRef<ContactsContactFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ContactsContactFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _auth: AuthTokenSessionService,
        private _contactService: ContactsService,
        private _matDialog: MatDialog,
        public fn: CommonFn
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Contact';
            this.contact = _data.contact;
            this.newContact = false;
        }
        else
        {
            this.dialogTitle = 'New Contact';
            this.contact = new Contact({});
            this.contact.user_id = this._auth.currentAuthUser.id;
            this.newContact = true;
        }

        this.contactForm = this.createContactForm();


        // Set the private defaults
        this._unsubscribeAll = new Subject();


    }

    ngOnInit(): void {
        this._userService.usersByKeywordOnChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(users => {
            this.filteredUsers = users;
            let rmIdx = -1;
            this.filteredUsers.some((user, idx) => {
                if (user.id === this._auth.currentAuthUser.id) {
                    rmIdx = idx;
                    return true;
                }
            });
            if (rmIdx !== -1) {
                this.filteredUsers.splice(rmIdx, 1);
            }
        });
        this.searchCtrl.valueChanges
        .pipe(
          debounceTime(500),
          startWith(''))
        .subscribe(value => {
            if (this.newContact) {
                this.contactForm.controls.first_name.setValue(value);
                this._filter(value);
            }
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

    private _filter(value: string): void {
        if (!this.fn.emptyStr(value)) {
            const filterValue = this._normalizeValue(value);
            this._userService.getBasicUserInfoByKeyword(filterValue);
        } else {
            this.filteredUsers = [];
        }
    }
    private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createContactForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.contact.id],
            user_id      : [this.contact.user_id],
            friend_id      : [this.contact.friend_id],
            first_name    : [this.contact.first_name, [Validators.required]],
            last_name: [this.contact.last_name],
            avatar  : [this.contact.avatar],
            nickname: [this.contact.nickname],
            company : [this.contact.company],
            job_title: [this.contact.job_title],
            email   : [this.contact.email],
            mobile_no   : [this.contact.mobile_no],
            address : [this.contact.address],
            birthday: [this.contact.birthday],
            notes   : [this.contact.notes],
            friend_status: [this.contact.friend_status],
            blockUser: [this.contact.friend_status === 'BLOCKED']
        });
    }

    /**
     * Select user to populate form if user is not already on list and user had
     * not block login user
     * @param user - new user
     */
    selectUser(user: any): void {
        if (this._contactService.inContact(user.id)) {
            this.confirmDialogRef = this._matDialog.open(OkDialogComponent, {
                disableClose: false
            });
            this.confirmDialogRef.componentInstance.confirmMessage = 'User is already In Contact List';
            this.confirmDialogRef.afterClosed().subscribe(result => {
                this.confirmDialogRef = null;
            });
        } else {
        this._contactService.checkBlockByFriend(user.id).then((resp) => {
            if (resp.blocked) {
                this.confirmDialogRef = this._matDialog.open(OkDialogComponent, {
                    disableClose: false
                });
                this.confirmDialogRef.componentInstance.confirmMessage = 'User Has Blocked You';
                this.confirmDialogRef.afterClosed().subscribe(result => {
                    this.confirmDialogRef = null;
                });
            } else {
                this._userService.getUserData(user.id).then ((userData) => {
                    this.selectedUser = userData;
                    this.contactForm.setValue({
                        id: '',
                        user_id: this._auth.currentAuthUser.id,
                        friend_id: userData.id,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        avatar: userData.avatar,
                        nickname: '',
                        company: userData.company,
                        job_title: '',
                        email: '',
                        mobile_no: '',
                        address: '',
                        birthday: '',
                        notes: '',
                        friend_status: 'REQUEST',
                        blockUser: false
                    });
                    this.contact.avatar = userData.avatar;
                    this.contact.first_name = userData.first_name;
                    this.contact.last_name = userData.last_name;
                });
            }
        }).catch(() => {
            this.confirmDialogRef = this._matDialog.open(OkDialogComponent, {
                disableClose: false
            });
            this.confirmDialogRef.componentInstance.confirmMessage = 'Unable to Select User';
            this.confirmDialogRef.afterClosed().subscribe(result => {
                this.confirmDialogRef = null;
            });
        })
        }

    }
}
