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
    about = '/api/users/profile-about/byUserId',
    friends = '/api/friends/friendList/byUserId',
    groups = '/api/groups/byUserId',
    timeline = '/api/posts/profile-timeline/byUserIdOffSetDays',
    activities = '/api/activities/activityList/byUserIdOffSetDays',
    media = '/api/medias/byUserId',
    increment_likes = '/api/posts/likes',
    increment_share = '/api/posts/share',
    userGroups = '/api/userGroups/byUserId',

    // local web server path
    SETTINGS_JSON_LOCATION = 'assets/app-settings.json'

}
