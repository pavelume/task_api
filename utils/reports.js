// utils/reports.js
const json2csv = require('json2csv').parse;
const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * Generate CSV Report
 */
const generateCSV = (leads, campaigns) => {
  const csv = json2csv({ leads, campaigns });
  return csv;
};

/**
 * Generate PDF Report
 */
const generatePDF = (leads, campaigns) => {
  const doc = new PDFDocument();
  doc.text('Leads Report');
  leads.forEach(lead => doc.text(`${lead.name} - ${lead.email}`));

  doc.addPage().text('Campaigns Report');
  campaigns.forEach(campaign => doc.text(`${campaign.name} - Budget: ${campaign.budget}`));

  return doc;
};

module.exports = { generateCSV, generatePDF };
