// models/data.js
const mongoose = require('mongoose');

// Lead Schema
const LeadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  source: String,
  created_at: { type: Date, default: Date.now }
});

// Campaign Schema
const CampaignSchema = new mongoose.Schema({
  name: String,
  budget: Number,
  startDate: Date,
  endDate: Date,
  created_at: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', LeadSchema);
const Campaign = mongoose.model('Campaign', CampaignSchema);

module.exports = { Lead, Campaign };
