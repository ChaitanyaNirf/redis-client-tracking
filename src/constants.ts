export default Object.freeze({
    REDIS_PASSWORD : "enter your redis host password",
    REDIS_HOST : "enter your redis host creds",
    REDIS_PORT : 6379,
    CLIENT_TRACKING_MODES : {
        BCAST : "BCAST",
        OPTIN: "OPTIN",
        DEFAULT: "DEFAULT"
    },
    REDIS_INVALIDATE_CHANNEL : '__redis__:invalidate',
    REDIS_COMMANDS : {
        CLIENT_ID : ['CLIENT', 'ID'],
        OPT_IN_CACHE : ['CLIENT', 'CACHING', 'YES']
    }
});
