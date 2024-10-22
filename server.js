// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const { sendAlertEmail } = require('./utils/email');
const { generateCSV, generatePDF } = require('./utils/reports');
const { Lead, Campaign } = require('./models/data');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/ezymetrics', { useNewUrlParser: true, useUnifiedTopology: true });

/**
 * Simulated Fetching of Leads from a Dummy CRM
 */
app.get('/api/fetch-leads', async (req, res) => {
  try {
    // Simulating API request to a CRM
    const response = await axios.get('https://dummy-crm.com/leads');
    const leads = response.data;

    // Save leads to DB
    await Lead.insertMany(leads);

    res.json({ message: 'Leads data fetched and stored', data: leads });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leads', error });
  }
});

/**
 * Simulated Fetching of Campaign Data from a Dummy Marketing Platform
 */
app.get('/api/fetch-campaigns', async (req, res) => {
  try {
    // Simulating API request to a marketing platform
    const response = await axios.get('https://dummy-marketing.com/campaigns');
    const campaigns = response.data;

    // Save campaigns to DB
    await Campaign.insertMany(campaigns);

    res.json({ message: 'Campaign data fetched and stored', data: campaigns });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaigns', error });
  }
});

/**
 * Generate Reports (CSV/PDF) based on stored data
 */
app.get('/api/report/:format', async (req, res) => {
  try {
    const leads = await Lead.find();
    const campaigns = await Campaign.find();

    if (req.params.format === 'csv') {
      const csvReport = generateCSV(leads, campaigns);
      res.header('Content-Type', 'text/csv');
      res.attachment('report.csv');
      return res.send(csvReport);
    }

    if (req.params.format === 'pdf') {
      const pdfReport = generatePDF(leads, campaigns);
      res.header('Content-Type', 'application/pdf');
      res.attachment('report.pdf');
      return pdfReport.pipe(res);
    }

    res.status(400).json({ message: 'Invalid format specified' });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error });
  }
});

/**
 * Alert if certain conditions are met (e.g., more than 1000 leads)
 */
app.get('/api/check-alerts', async (req, res) => {
  const leadCount = await Lead.countDocuments();

  if (leadCount > 1000) {
    sendAlertEmail('admin@ezymetrics.com', 'Lead threshold exceeded', `There are ${leadCount} leads in the system.`);
    res.json({ message: 'Alert email sent' });
  } else {
    res.json({ message: 'No alerts triggered' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
