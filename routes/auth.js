const express = require('express');
const router = express.Router();
const email = require('../helpers/email');

// @route   GET /auth/gmail
// @desc    Enable app to use gmail
// @access  Public
router.get('/gmail', async (req, res) => {
  res.redirect(await email.generateAuthUrl());
});

// @route   GET /auth/gmail/callback
// @desc    Enable app to use gmail
// @access  Public
router.get('/gmail/callback', async (req, res) => {
  await email.setAccount(req.query.code);
  res.redirect('/');
});

module.exports = router;
