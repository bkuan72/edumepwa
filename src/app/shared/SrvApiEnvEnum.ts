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

    userDTO= '/api/users/DTO',
    insUserDTO= '/api/users/insDTO',
    updUserDTO= '/api/users/updDTO',
    userSchema= '/api/users/schema',
    updateUserAvatar= '/api/users/updateAvatar',

    about = '/api/users/profile-about/byUserId',
    friends = '/api/friends/friendList/byUserId',
    groups = '/api/groups/byUserId',
    activities = '/api/activities/activityList/byTimelineUserIdOffSetDays',
    media = '/api/userMedias/byUserId',
    increment_likes = '/api/posts/likes',
    increment_share = '/api/posts/share',
    userGroups = '/api/userGroups/byUserId',
    regConfirmation = '/api/auth/confirm/byEmailNRegConfirmKey',
    newPasswordConfirmation = '/api/auth/resetPassword/byEmailNresetConfirmKeyNnewPassword',
    resetPassword = '/api/auth/resetPassword/byEmail',
    validResetPasswordKey = '/api/auth/confirm/byEmailResetPasswordKey',
    userByUserId = '/api/users/byUserId',
    basicUserByUserId = '/api/users/basicInfo/byUserId',

    userTimeline = '/api/userTimelines/profile-timeline/timelineUserIdNOffsetDays',
    userTimelineDTO= '/api/userTimelines/timelineDTO',
    userTimelineLike= '/api/userTimelines/like',
    userTimelineUnlike= '/api/userTimelines/unlike',

    userPost= '/api/posts',
    userTimelines= '/api/userTimelines',
    postDTO= '/api/posts/DTO',
    updPostDTO= '/api/posts/updDTO',
    postSchema= '/api/posts/schema',

    postMedia= '/api/postMedias',
    postMediaDTO= '/api/postMedias/DTO',
    postMediaSchema= '/api/postMedias/schema',
    postMediaByPostId= '/api/postMedias/byPostId',


    userActivitiesLikes= '/api/activities/likes',
    findUserTimelineLikeActivity= '/api/activities/likes/byTimelineIdUserId',
    userActivityRemove= '/api/activities/remove',

    userTimelineComments = '/api/userTimelineComments',
    userTimelineCommentDTO= '/api/userTimelineComments/DTO',
    updUserTimelineCommentDTO= '/api/userTimelineComments/updDTO',
    userTimelineCommentSchema= '/api/userTimelineComments/schema',
    userTimelineCommentsByTimelineId= '/api/userTimelineComments/byTimelineId',

    adCategories= '/api/adCategories',
    patchAdCategories= '/api/adCategories',
    findAdCategoryCode= '/api/adCategories/byCategoryCode',
    adCategoriesDTO= '/api/adCategories/DTO',
    adCategoriesUpdDTO= '/api/adCategories/updDTO',
    adCategoriesSchema= '/api/adCategories/schema',
    deleteAdCategories= '/api/adCategories/delete',

    adKeywords= '/api/adKeywords',
    patchAdKeywords= '/api/adKeywords',
    findAdKeywordCode= '/api/adKeywords/byKeywordCode',
    adKeywordsDTO= '/api/adKeywords/DTO',
    adKeywordsUpdDTO= '/api/adKeywords/updDTO',
    adKeywordsSchema= '/api/adKeywords/schema',
    deleteAdKeywords= '/api/adKeywords/delete',

    adAgeGroups= '/api/adAgeGroups',
    patchAdAgeGroups= '/api/adAgeGroups',
    findAdAgeGroupCode= '/api/adAgeGroups/byAgeGroupCode',
    adAgeGroupsDTO= '/api/adAgeGroups/DTO',
    adAgeGroupsUpdDTO= '/api/adAgeGroups/updDTO',
    adAgeGroupsSchema= '/api/adAgeGroups/schema',
    deleteAdAgeGroups= '/api/adAgeGroups/delete',

    // local web server path
    SETTINGS_JSON_LOCATION = 'assets/app-settings.json',
    COUNTRIES_JSON = 'assets/data/countries.json',
    TITLES_JSON = 'assets/data/titles.json'

}
