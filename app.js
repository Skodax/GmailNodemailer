const express = require('express');
const email = require('./helpers/email');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('<a href="/send-email">Send Email</a>');
});

app.get('/send-email', (req, res) => {
  if (!email.getProfile()) {
    res.redirect('/auth/gmail');
  } else {
    const transporter = email.getTransporter();
    const profile = email.getProfile();
    transporter.sendMail(
      {
        from: profile.email,
        to: 'jangomezescoda@gmail.com',
        subject: 'Message2',
        text: 'I hope this message gets through!'
      },
      (err, info) => {
        if (err) {
          res.send('Error has ocurred');
        } else {
          res.send('Email sent!');
        }
      }
    );
  }
});

app.use('/auth', require('./routes/auth'));

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
