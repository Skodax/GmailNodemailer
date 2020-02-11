const express = require('express');
const router = express.Router();

const { google } = require('googleapis');
const keys = require('../config/oauth2.keys.json').web;

const nodemailer = require('nodemailer');

const oauth2Client = new google.auth.OAuth2(
  keys.client_id,
  keys.client_secret,
  keys.redirect_uris[0]
);

const email = require('../helpers/email');

// @route   GET /auth/gmail
// @desc    Enable app to use gmail
// @access  Public
router.get('/gmail', async (req, res) => {
  const authorizeUrl = await oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://mail.google.com/',
      'https://www.googleapis.com/auth/userinfo.profile'
    ]
  });
  res.redirect(authorizeUrl);
});

// @route   GET /auth/gmail/callback
// @desc    Enable app to use gmail
// @access  Public
router.get('/gmail/callback', async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code);
  oauth2Client.credentials = tokens;

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2'
  });

  const gmail = google.gmail({
    auth: oauth2Client,
    version: 'v1'
  });

  let profile = (await oauth2.userinfo.get()).data;
  profile.email = (
    await gmail.users.getProfile({ userId: 'me' })
  ).data.emailAddress;

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: profile.email,
      accessToken: tokens.access_token
    }
  });

  transporter.sendMail(
    {
      from: profile.email,
      to: 'jangomezescoda@gmail.com',
      subject: 'Message1',
      text: 'I hope this message gets through!'
    },
    (err, info) => {
      if (err) {
        res.json(err);
      } else {
        res.json({ info: info, profile: profile });
      }
    }
  );
});

module.exports = router;
