
const TIER_RATES = {
    tier1: {
        WINDOW_SIZE_IN_HOURS: 24,
        MAX_REQUESTS: 1000,
        WINDOW_LOG_INTERVAL_IN_HOURS: 1
    },
    tier2: {
        WINDOW_SIZE_IN_HOURS: 24,
        MAX_REQUESTS: 100,
        WINDOW_LOG_INTERVAL_IN_HOURS: 1
    }
};

module.exports = {
    TIER_RATES
};
