export const AppConfig = {
    name: 'Unite',
    default_error: 'Something went wrong',
    connection_error: 'Unable to connect to server (check your connection)',
    access_deny_error: 'Access denied to requested service',

    logout_success_msg: 'You are logged out',
    default_setting: {
        preferredTime: 20,
        goodTimes: [9, 22]
    },

    reflection_notification_title: 'Your reflection activity is ready...',
    survey_notification_title: 'How is your day? Please respond to a quick survey.',
    RECENT_TRESHOLD: 60 * 60 * 8,
    OURA_RECENT_TRESHOLD: 60 * 60 * 24 * 2,
    OURA_SYNC_FREQ: 60 * 60 * 8,
    OURA_SYNC_START: 0,
    LATE_TRESHOLD: 60 * 60 * 24,
    nutritionix: {
        id: 'ba887f34',
        key: '9449bf043392c28b052ff9f363362e0e',
        base_url: 'https://trackapi.nutritionix.com/'
    },
    partial_save_expiration: 60 * 60 * 20
};
