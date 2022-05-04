// Please add entry to assets/app-settings.json for each entry here
// the server will read the that json file to configure the values below
export class AppSettings {
    defaultUrl = 'http://localhost:33001';  // backend API Gateway server path
    propertiesPrefix = 'ls10_net.co.nz';  // prefix to use for prefixing properties for the frontend server eg domain.co.nz.token.expiry.in.minutes
    googleApiKey = '';       // google API Key
    tokenRenewalIntervalInMin = undefined; // check expiry of token interval in minutes
    tokenRenewBeforeMin = 5; // renew token before x min of expiry
    searchPageLines = 10; // number of result per search page
    paginationRange = 3;  // number of page to show before a pagination '...' icon is displayed
    postHistoryDays = 10; // number of days into the past to retrieve
    deliveryLoginUrl = 'http://localhost:8083'; // Ls10Deliver server path
}
