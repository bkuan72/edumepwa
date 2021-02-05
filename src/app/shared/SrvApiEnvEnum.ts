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


    // local web server path
    SETTINGS_JSON_LOCATION = 'assets/app-settings.json',
    COUNTRIES_JSON = 'assets/countries.json',
    TITLES_JSON = 'assets/titles.json'

}
