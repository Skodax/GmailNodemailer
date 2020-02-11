const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// Get App credentials from file
const keys = require('../config/oauth2.keys.json').web;

// Set up OAuth2
const oauth2Client = new google.auth.OAuth2(
  keys.client_id,
  keys.client_secret,
  keys.redirect_uris[0]
);

// User info
let profile = null;

// Nodemailer Transporter
let transporter = null;

module.exports.generateAuthUrl = async () => {
  const authorizeUrl = await oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://mail.google.com/',
      'https://www.googleapis.com/auth/userinfo.profile'
    ]
  });

  return authorizeUrl;
};

module.exports.setAccount = async authorizationCode => {
  // Get access and refresh token from Google
  const { tokens } = await oauth2Client.getToken(authorizationCode);
  oauth2Client.credentials = tokens;

  // OAuth API
  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2'
  });

  // Gmail API
  const gmail = google.gmail({
    auth: oauth2Client,
    version: 'v1'
  });

  // Get user info
  profile = (await oauth2.userinfo.get()).data;

  // Get user email address
  profile.email = (
    await gmail.users.getProfile({ userId: 'me' })
  ).data.emailAddress;

  // Create nodemailer transporter
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: profile.email,
      accessToken: tokens.access_token
    }
  });
};

module.exports.getTransporter = () => transporter;
module.exports.getProfile = () => profile;
