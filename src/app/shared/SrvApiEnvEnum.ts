export enum SrvApiEnvEnum {
    // backend server path
    login = '/api/auth/login',
    logout = '/api/auth/logout',
    register = '/api/auth/register',
    log = '/api/logs',
    renewToken = '/api/auth/renew/token',
    properties = '/api/properties',
    advertisementSearch = '/api/advertisements/search/',
    advertisements = '/api/advertisements',
    userDTO= '/api/users/DTO',
    updUserDTO= '/api/users/updDTO',
    userSchema= '/api/users/schema',
    about = '/api/users/profile-about/byUserId',
    friends = '/api/friends/friendList/byUserId',
    groups = '/api/groups/byUserId',
    timeline = '/api/posts/profile-timeline/byUserIdOffSetDays',
    activities = '/api/activities/activityList/byUserIdOffSetDays',
    media = '/api/medias/byUserId',
    increment_likes = '/api/posts/likes',
    increment_share = '/api/posts/share',
    userGroups = '/api/userGroups/byUserId',
    regConfirmation = '/api/auth/confirm/byEmailNRegConfirmKey',
    newPasswordConfirmation = '/api/auth/resetPassword/byEmailNresetConfirmKeyNnewPassword',
    resetPassword = '/api/auth/resetPassword/byEmail',
    validResetPasswordKey = '/api/auth/confirm/byEmailResetPasswordKey',
    userByUserId = '/api/users/byUserId',
    basicUserByUserId = '/api/users/basicInfo/byUserId',

    // local web server path
    SETTINGS_JSON_LOCATION = 'assets/app-settings.json',
    COUNTRIES_JSON = 'assets/countries.json',
    TITLES_JSON = 'assets/titles.json'

}
