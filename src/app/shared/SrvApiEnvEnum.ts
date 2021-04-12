export enum SrvApiEnvEnum {
    // backend server path
    login = '/api/auth/login',
    logout = '/api/auth/logout',
    register = '/api/auth/register',
    log = '/api/logs',
    renewToken = '/api/auth/renew/token',
    properties = '/api/properties',

    advertisementSearch = '/api/advertisements/search',
    advertisements = '/api/advertisements',
    advertisementsFilterDTO = '/api/advertisements/filterDTO',

    userDTO= '/api/users/DTO',
    insUserDTO= '/api/users/insDTO',
    updUserDTO= '/api/users/updDTO',
    usersSchema= '/api/users/schema',
    updateUserAvatar= '/api/users/updateAvatar',
    findUserByEmail= '/api/users/byEmail',
    basicUserByKeyword = '/api/users/basicInfo/byKeyword',

    friends = '/api/friends/friendList/byUserId',
    areFriends= '/api/friends/areFriends',
    userContactsByUserId= '/api/friends/contactList/byUserId',
    userContactsUpdate= '/api/friends',
    toggleContactStar= '/api/friends/toggleStar',
    incrContactFrequency= '/api/friends/incrFrequency',
    removeContact= '/api/friends/remove',
    friendDTO= '/api/friends/DTO',
    updFriendDTO= '/api/friends/updDTO',
    friendsSchema= '/api/friends/schema',
    blockedByUser= '/api/friends/isBlockedByFriend',

    about = '/api/users/profile-about/byUserId',
    aboutAccount = '/api/accounts/profile-about/byAccountId',
    groups = '/api/groups/byUserId',

    activities = '/api/activities/activityList/byTimelineUserIdOffSetDays',
    removeActivity = '/api/activities/remove',
    increment_likes = '/api/posts/likes',
    increment_share = '/api/posts/share',

    userGroups = '/api/userGroups/byUserId',
    accountGroups = '/api/userGroups/byAccountId',
    groupGroups = '/api/userGroups/byGroupId',

    regConfirmation = '/api/auth/confirm/byEmailNRegConfirmKey',
    newPasswordConfirmation = '/api/auth/resetPassword/byEmailNresetConfirmKeyNnewPassword',
    resetPassword = '/api/auth/resetPassword/byEmail',
    validResetPasswordKey = '/api/auth/confirm/byEmailResetPasswordKey',
    userByUserId = '/api/users/byUserId',
    basicUserByUserId = '/api/users/basicInfo/byUserId',

    userPost= '/api/posts',
    userTimelines= '/api/userTimelines',
    postDTO= '/api/posts/DTO',
    updPostDTO= '/api/posts/updDTO',
    postSchema= '/api/posts/schema',

    postMedia= '/api/postMedias',
    postMediaDTO= '/api/postMedias/DTO',
    postMediaSchema= '/api/postMedias/schema',
    postMediaByPostId= '/api/postMedias/byPostId',

    userTimeline = '/api/userTimelines/profile-timeline/timelineUserIdNOffsetDays',
    userTimelineDTO= '/api/userTimelines/timelineDTO',
    userTimelineLike= '/api/userTimelines/like',
    userTimelineUnlike= '/api/userTimelines/unlike',

    userActivitiesLikes= '/api/activities/likes',
    findUserTimelineLikeActivity= '/api/activities/likes/byTimelineIdUserId',
    userActivityRemove= '/api/activities/remove',

    userTimelineComments = '/api/userTimelineComments',
    userTimelineCommentDTO= '/api/userTimelineComments/DTO',
    updUserTimelineCommentDTO= '/api/userTimelineComments/updDTO',
    userTimelineCommentSchema= '/api/userTimelineComments/schema',
    userTimelineCommentsByTimelineId= '/api/userTimelineComments/byTimelineId',

    adCategories= '/api/adCategories',
    adCategoryCodes= '/api/adCategories/codesOnly',
    patchAdCategories= '/api/adCategories',
    findAdCategoryCode= '/api/adCategories/byCategoryCode',
    adCategoriesDTO= '/api/adCategories/DTO',
    adCategoriesUpdDTO= '/api/adCategories/updDTO',
    adCategoriesSchema= '/api/adCategories/schema',
    deleteAdCategories= '/api/adCategories/delete',

    adKeywords= '/api/adKeywords',
    adKeywordCodes= '/api/adKeywords/codesOnly',
    patchAdKeywords= '/api/adKeywords',
    findAdKeywordCode= '/api/adKeywords/byKeywordCode',
    adKeywordsDTO= '/api/adKeywords/DTO',
    adKeywordsUpdDTO= '/api/adKeywords/updDTO',
    adKeywordsSchema= '/api/adKeywords/schema',
    deleteAdKeywords= '/api/adKeywords/delete',

    adAgeGroups= '/api/adAgeGroups',
    adAgeGroupCodes= '/api/adAgeGroups/codesOnly',
    patchAdAgeGroups= '/api/adAgeGroups',
    findAdAgeGroupCode= '/api/adAgeGroups/byAgeGroupCode',
    adAgeGroupsDTO= '/api/adAgeGroups/DTO',
    adAgeGroupsUpdDTO= '/api/adAgeGroups/updDTO',
    adAgeGroupsSchema= '/api/adAgeGroups/schema',
    deleteAdAgeGroups= '/api/adAgeGroups/delete',

    accounts= '/api/accounts',
    newServiceAccount='/api/accounts/service',
    newNormalAccount='/api/accounts/normal',
    accountById= '/api/accounts/byAccountId',
    updateAccountAvatar= '/api/accounts/avatar/byAccountId',
    patchAccounts= '/api/accounts/byAccountId',
    findAccountCode= '/api/accounts/byAccountCode',
    accountsDTO= '/api/accounts/DTO',
    accountsUpdDTO= '/api/accounts/updDTO',
    accountsSchema= '/api/accounts/schema',
    basicAccountByAccountId = '/api/accounts/basicInfo/byAccountId',

    userAccounts= '/api/userAccounts',
    userAccountsByUserId= '/api/userAccounts/byUserId',
    patchUserAccounts= '/api/userAccounts/byAccountId',
    userAccountsDTO= '/api/userAccounts/DTO',
    userAccountsUpdDTO= '/api/userAccounts/updDTO',
    userAccountsSchema= '/api/userAccounts/schema',
    userAccountsDataDTO= '/api/userAccounts/userAccountDTO',

    userMediaPeriods= '/api/userMediaPeriods',
    userMediaPeriodDTO= '/api/userMediaPeriods/DTO',
    userMediaPeriodUpdDTO= '/api/userMediaPeriods/updDTO',
    userMediaPeriodsSchema= '/api/userMediaPeriods/schema',
    userMediaPeriodsByUserId= '/api/userMediaPeriods/byUserId',

    userMedias= '/api/userMedias',
    userMediaDTO= '/api/userMedias/DTO',
    userMediaUpdDTO= '/api/userMedias/updDTO',
    userMediasSchema= '/api/userMedias/schema',
    userMediasByUserId= '/api/userMedias/byUserId',
    userMediasByUserMediaPeriodId= '/api/userMedias/byUserMediaPeriodId',

    accountActivities = '/api/accountGroupActivities/accountActivityList/byTimelineAccountIdOffSetDays',
    groupActivities = '/api/accountGroupActivities/groupActivityList/byTimelineGroupIdOffSetDays',
    removeAccountGroupActivity = '/api/activities/remove',

    accountMembers = '/api/accountGroupMembers/accountGroupMemberList/byAccountId',
    areAccountMembers= '/api/accountGroupMembers/areAccountMembers',

    // userContactsByUserId= '/api/friends/contactList/byUserId',
    // userContactsUpdate= '/api/friends',
    // toggleContactStar= '/api/friends/toggleStar',
    // incrContactFrequency= '/api/friends/incrFrequency',
    // removeContact= '/api/friends/remove',
    // friendDTO= '/api/friends/DTO',
    // updFriendDTO= '/api/friends/updDTO',
    // friendsSchema= '/api/friends/schema',
    // blockedByUser= '/api/friends/isBlockedByFriend',

    accountGroupTimelineDTO= '/api/accountGroupTimelines/timelineDTO',
    accountTimeline = '/api/accountGroupTimelines/profile-timeline/timelineAccountIdNOffsetDays',
    groupTimeline = '/api/accountGroupTimelines/profile-timeline/timelineGroupIdNOffsetDays',

    accountGroupTimelineLike= '/api/accountGroupTimelines/like',
    accountGroupTimelineUnlike= '/api/accountGroupTimelines/unlike',


    accountActivitiesLikes= '/api/accountGroupActivities/account/likes',
    groupActivitiesLikes= '/api/accountGroupActivities/group/likes',
    findAccountTimelineLikeActivity= '/api/accountGroupActivities/likes/byTimelineIdAccountId',
    findGroupTimelineLikeActivity= '/api/accountGroupActivities/likes/byTimelineIdGroupId',
    accountGroupActivityRemove= '/api/accountGroupActivities/remove',

    accountGroupTimelineComments = '/api/accountGroupTimelineComments',
    accountGroupTimelineCommentDTO= '/api/accountGroupTimelineComments/DTO',
    updAccountGroupTimelineCommentDTO= '/api/accountGroupTimelineComments/updDTO',
    accountGroupTimelineCommentSchema= '/api/accountGroupTimelineComments/schema',
    accountGroupTimelineCommentsByTimelineId= '/api/accountGroupTimelineComments/byTimelineId',

    accountGroupMediaPeriods= '/api/accountGroupMediaPeriods',
    accountGroupMediaPeriodDTO= '/api/accountGroupMediaPeriods/DTO',
    accountGroupMediaPeriodUpdDTO= '/api/accountGroupMediaPeriods/updDTO',
    accountGroupMediaPeriodsSchema= '/api/accountGroupMediaPeriods/schema',
    accountGroupMediaPeriodsByAccountId= '/api/accountGroupMediaPeriods/byAccountId',
    accountGroupMediaPeriodsByGroupId= '/api/accountGroupMediaPeriods/byGroupId',


    accountGroupMedias= '/api/accountGroupMedias',
    accountGroupMediaDTO= '/api/accountGroupMedias/DTO',
    accountGroupMediaUpdDTO= '/api/accountGroupMedias/updDTO',
    accountGroupMediasSchema= '/api/accountGroupMedias/schema',
    accountGroupMediasByAccountId= '/api/accountGroupMedias/byAccountId',
    accountGroupMediasByAccountGroupMediaPeriodId= '/api/userMedias/byAccountGroupMediaPeriodId',

    userMediaFullImageById= '/api/userMedias/fullImage',
    accountGroupMediaFullImageById= '/api/accountGroupMedias/fullImage',




    // local web server path
    SETTINGS_JSON_LOCATION = 'assets/app-settings.json',
    COUNTRIES_JSON = 'assets/data/countries.json',
    TITLES_JSON = 'assets/data/titles.json'

}
