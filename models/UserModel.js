const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tier: { type: String, required: true, default: 'tier2' }, // Default to Tier2
  requestCount: { type: Number, default: 0 },
  lastRequestTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
