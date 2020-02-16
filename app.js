const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const email = require('./helpers/email');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//Connect flash
app.use(flash());

//Global Varialbes - MIDDLEWARE
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');

  // call next piece of middleware
  next();
});

// STATIC FILES
app.use('/public', express.static('public'));

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
          req.flash('error_msg', "Email hasn't been set due to an error");
          res.redirect('/');
        } else {
          req.flash('success_msg', `Email sent to ${req.body.to}`);
          res.redirect('/');
        }
      }
    );
  }
});

// AUTHENTICATION ROUTE
app.use('/auth', require('./routes/auth'));
app.use('/settings', require('./routes/settings'));

// INITIATE SERVER
app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
