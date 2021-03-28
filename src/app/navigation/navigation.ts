import { FuseNavigation, FuseNavigationItem } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id: 'home',
                title: 'Home',
                type: 'item',
                icon: 'home',
                url: 'search/modern',
                externalUrl: false
            },

        ]
    },
];

export const adminNavigation: FuseNavigation[] = [
    {
        id       : 'contacts',
        title    : 'Contacts',
        translate: 'NAV.CONTACTS',
        type     : 'item',
        icon     : 'account_box',
        url      : 'contacts'
    },
    {
        id      : 'admin.maintenance',
        title   : 'Maintenance',
        type    : 'collapsable',
        icon    : 'web',
        children: [
            {
                id: 'maintainAgeGroups',
                title: 'Maintain Age Groups',
                type: 'item',
                icon: 'people',
                url: 'maintain/ageGroups',
                externalUrl: false
            },
            {
                id: 'maintainCategories',
                title: 'Maintain Categories',
                type: 'item',
                icon: 'category',
                url: 'maintain/categories',
                externalUrl: false
            },
            {
                id: 'maintainKeywords',
                title: 'Maintain Keywords',
                type: 'item',
                icon: 'subject',
                url: 'maintain/keywords',
                externalUrl: false
            },
        ]
    }
];
export const devNavigation: FuseNavigation[] = [
    {
        id       : 'contacts',
        title    : 'Contacts',
        translate: 'NAV.CONTACTS',
        type     : 'item',
        icon     : 'account_box',
        url      : 'contacts'
    },
    {
        id      : 'admin.maintenance',
        title   : 'Maintenance',
        type    : 'collapsable',
        icon    : 'web',
        children: [
            {
                id: 'maintainAgeGroups',
                title: 'Maintain Age Groups',
                type: 'item',
                icon: 'people',
                url: 'maintain/ageGroups'
            },
            {
                id: 'maintainCategories',
                title: 'Maintain Categories',
                type: 'item',
                icon: 'category',
                url: 'maintain/categories'
            },
            {
                id: 'maintainKeywords',
                title: 'Maintain Keywords',
                type: 'item',
                icon: 'subject',
                url: 'maintain/keywords'
            },
        ]
    }
];
export const bizNavigation: FuseNavigation[] = [
    {
        id       : 'contacts',
        title    : 'Contacts',
        translate: 'NAV.CONTACTS',
        type     : 'item',
        icon     : 'account_box',
        url      : 'contacts'
    },
];
export const userNavigation: FuseNavigation[] = [
    {
        id       : 'contacts',
        title    : 'Contacts',
        translate: 'NAV.CONTACTS',
        type     : 'item',
        icon     : 'account_box',
        url      : 'contacts'
    },
];
