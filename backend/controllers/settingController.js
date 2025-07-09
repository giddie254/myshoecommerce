// ============================
// src/controllers/settingController.js
// ============================

import asyncHandler from 'express-async-handler';
import Setting from '../models/settingModel.js';

// @desc Get all settings
// @route GET /api/admin/settings
// @access Admin
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.find({});
  const payload = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});
  res.json(payload);
});

// @desc Update settings (key-value pairs)
// @route PUT /api/admin/settings
// @access Admin
export const updateSettings = asyncHandler(async (req, res) => {
  const inputs = req.body; // e.g. { storeName: "SokoHive", supportEmail: "support@sokohive.com" }
  const results = [];

  for (const [key, value] of Object.entries(inputs)) {
    const updated = await Setting.findOneAndUpdate(
      { key },
      { value: value || '' },
      { new: true, upsert: true }
    );
    results.push(updated);
  }

  res.json({ message: 'Settings updated successfully', updated: results });
});
