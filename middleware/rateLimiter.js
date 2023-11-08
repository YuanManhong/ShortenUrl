const UserModel = require('../models/UserModel');
const { TIER_RATES } = require('../config');

const resetRequestCount = async (userId) => {
    await UserModel.updateOne({ _id: userId }, { requestCount: 0, lastRequestTime: Date.now() });
};

const getRequestCount = async (userId) => {
    const user = await UserModel.findById(userId);
    // Reset request count if the last request was more than 24 hours ago
    if (Date.now() - user.lastRequestTime.getTime() > 24 * 60 * 60 * 1000) {
        await resetRequestCount(userId);
        return 0;
    }
    return user.requestCount;
};

const incrementRequestCount = async (userId) => {
    await UserModel.updateOne({ _id: userId }, { $inc: { requestCount: 1 }, lastRequestTime: Date.now() });
};

const rateLimiter = async (req, res, next) => {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
        return res.status(404).json('User not found');
    }

    const tier = user.tier;
    const requestCount = await getRequestCount(user.id);

    const maxRequests = TIER_RATES[tier] ? TIER_RATES[tier].MAX_REQUESTS : TIER_RATES['tier2'].MAX_REQUESTS;

    if (requestCount >= maxRequests) {
        return res.status(429).json('Rate limit exceeded');
    }

    await incrementRequestCount(user.id);
    next();
};

module.exports = rateLimiter;
