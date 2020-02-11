const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const emailAccount = require('./helpers/email');

app.get('/', (req, res) => {
  res.send('Go to /auth/gmail to enable your mail account');
});

app.use('/auth', require('./routes/auth'));

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
