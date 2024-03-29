import { FuseUtils } from '@fuse/utils';

export class MemberContact
{
    id: string;
    // tslint:disable-next-line:variable-name
    account_id: string;
    // tslint:disable-next-line:variable-name
    user_id: string;
    // tslint:disable-next-line:variable-name
    first_name: string;
    // tslint:disable-next-line:variable-name
    last_name: string;
    avatar: string;
    nickname: string;
    company: string;
    // tslint:disable-next-line:variable-name
    job_title: string;
    email: string;
    // tslint:disable-next-line:variable-name
    mobile_no: string;
    address: string;
    birthday: string;
    notes: string;
    starred: boolean;
    frequent: number;
    // tslint:disable-next-line:variable-name
    member_status: string;

    blockUser: boolean;

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact)
    {
        {
            this.id = contact.id || '';
            this.account_id = contact.account_id || '';
            this.user_id = contact.user_id || '';
            this.first_name = contact.first_name || '';
            this.last_name = contact.last_name || '';
            this.avatar = contact.avatar || '';
            this.nickname = contact.nickname || '';
            this.company = contact.company || '';
            this.job_title = contact.job_title || '';
            this.email = contact.email || '';
            this.mobile_no = contact.mobile_no || '';
            this.address = contact.address || '';
            this.birthday = contact.birthday || '';
            this.notes = contact.notes || '';
            this.starred = contact.starred || false;
            this.frequent = contact.frequent || 0;
            this.member_status = contact.member_status || 'REQUEST';
            this.blockUser = contact.friend_status === 'BLOCKED' || false;
        }
    }
}
