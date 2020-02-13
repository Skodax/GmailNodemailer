const express = require('express');
const router = express.Router();

const email = require('../helpers/email');

router.get('/', (req, res) => {
  res.redirect('/settings/accounts');
});

router.get('/accounts', (req, res) => {
  res.render('settings/accounts', {
    email: email.getProfile()
  });
});

module.exports = router;
