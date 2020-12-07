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

    // local web server path
    SETTINGS_JSON_LOCATION = 'assets/app-settings.json'

}
