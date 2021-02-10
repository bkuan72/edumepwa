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
                url: 'search/modern'
            },
        ]
    },
];

export const adminNavigation: FuseNavigation[] = [
    {
        id: 'user.profile',
        title: 'Maintain Profile',
        type: 'item',
        icon: 'account_circle',
        url: 'maintain/profile'
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
export const devNavigation: FuseNavigation[] = [
    {
        id: 'user.profile',
        title: 'Maintain Profile',
        type: 'item',
        icon: 'account_circle',
        url: 'maintain/profile'
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
        id: 'user.profile',
        title: 'Maintain Profile',
        type: 'item',
        icon: 'account_circle',
        url: 'maintain/profile'
    },
];
export const userNavigation: FuseNavigation[] = [
    {
        id: 'user.profile',
        title: 'Maintain Profile',
        type: 'item',
        icon: 'account_circle',
        url: 'maintain/profile'
    },
];
