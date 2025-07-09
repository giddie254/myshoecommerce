// controllers/emailController.js
import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

let transporter;

// Setup transport using environment variables
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const emailLogs = []; // Temporary store; ideally replace with DB model

// @desc    Send marketing emails
// @route   POST /api/emails/send
// @access  Private/Admin
export const sendMarketingEmail = asyncHandler(async (req, res) => {
  const { subject, message, target } = req.body;

  if (!subject || !message) {
    res.status(400);
    throw new Error('Subject and message are required');
  }

  let recipients = [];
  if (target === 'all') {
    recipients = await User.find({}, 'email');
  } else if (target === 'buyers') {
    recipients = await User.find({ hasOrdered: true }, 'email');
  } else if (target === 'non-buyers') {
    recipients = await User.find({ hasOrdered: false }, 'email');
  } else {
    res.status(400);
    throw new Error('Invalid target group');
  }

  const emails = recipients.map((u) => u.email);

  const info = await transporter.sendMail({
    from: `SokoHive <${process.env.SMTP_USER}>`,
    to: emails,
    subject,
    html: `<div>${message}</div>`
  });

  emailLogs.unshift({ subject, message, target, date: new Date(), count: emails.length });

  res.status(200).json({ message: 'Emails sent', info, count: emails.length });
});

// @desc    Get recent email logs
// @route   GET /api/emails/history
// @access  Private/Admin
export const getEmailLogs = asyncHandler(async (req, res) => {
  res.json(emailLogs.slice(0, 20));
});

