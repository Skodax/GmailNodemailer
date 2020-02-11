const express = require('express');
const exphbs = require('express-handlebars');
const email = require('./helpers/email');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// HOME PAGE
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/send-email', (req, res) => {
  if (!email.getProfile()) {
    res.redirect('/auth/gmail');
  } else {
    const transporter = email.getTransporter();
    const profile = email.getProfile();
    transporter.sendMail(
      {
        from: profile.email,
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.message
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

// AUTHENTICATION ROUTE
app.use('/auth', require('./routes/auth'));

// INITIATE SERVER
app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
